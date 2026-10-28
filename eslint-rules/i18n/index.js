import fs from 'node:fs';
import path from 'node:path';

const localeCache = new Map();

function loadJson(file) {
    const stat = fs.statSync(file);
    const cached = localeCache.get(file);

    if (cached && cached.mtimeMs === stat.mtimeMs) {
        return cached.data;
    }

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    localeCache.set(file, { mtimeMs: stat.mtimeMs, data });

    return data;
}

function flatten(value, prefix = '', keys = new Set()) {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        if (prefix) {
            keys.add(prefix);
        }

        return keys;
    }

    for (const [key, child] of Object.entries(value)) {
        flatten(child, prefix ? `${prefix}.${key}` : key, keys);
    }

    return keys;
}

function localeKeys(cwd, localesDir, locale) {
    const file = path.resolve(cwd, localesDir, `${locale}.json`);

    return flatten(loadJson(file));
}

function calleeName(callee) {
    if (callee.type === 'Identifier') {
        return callee.name;
    }

    if (
        callee.type === 'MemberExpression' &&
        !callee.computed &&
        callee.property.type === 'Identifier'
    ) {
        return callee.property.name;
    }

    return null;
}

function literalString(node) {
    if (!node) {
        return null;
    }

    if (node.type === 'Literal' && typeof node.value === 'string') {
        return node.value;
    }

    if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
        return node.quasis[0].value.cooked;
    }

    return null;
}

const noMissingKey = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Validate that i18n keys used with t() and Trans exist in every locale.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    localesDir: { type: 'string' },
                    locales: { type: 'array', items: { type: 'string' } },
                    functions: { type: 'array', items: { type: 'string' } },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            missing: 'i18n key "{{key}}" is missing in: {{locales}}.',
        },
    },

    create(context) {
        const options = context.options[0] ?? {};
        const cwd = context.cwd ?? process.cwd();
        const localesDir = options.localesDir ?? 'resources/js/i18n/locales';
        const locales = options.locales ?? ['en', 'id'];
        const functions = new Set(options.functions ?? ['t']);
        let sets;

        function getSets() {
            sets ??= new Map(
                locales.map((locale) => [
                    locale,
                    localeKeys(cwd, localesDir, locale),
                ]),
            );

            return sets;
        }

        function check(node, key) {
            if (!key) {
                return;
            }

            const normalized = key.startsWith('translation:')
                ? key.slice('translation:'.length)
                : key;

            // Keys with a namespace prefix live outside the default bundle.
            if (normalized.includes(':')) {
                return;
            }

            const missing = locales.filter(
                (locale) => !getSets().get(locale).has(normalized),
            );

            if (missing.length > 0) {
                context.report({
                    node,
                    messageId: 'missing',
                    data: { key: normalized, locales: missing.join(', ') },
                });
            }
        }

        return {
            CallExpression(node) {
                const name = calleeName(node.callee);

                if (!name || !functions.has(name)) {
                    return;
                }

                const key = literalString(node.arguments[0]);

                if (key !== null) {
                    check(node.arguments[0], key);
                }
            },

            JSXAttribute(node) {
                if (
                    node.name.type !== 'JSXIdentifier' ||
                    node.name.name !== 'i18nKey'
                ) {
                    return;
                }

                const key = literalString(node.value);

                if (key !== null) {
                    check(node.value, key);
                }
            },
        };
    },
};

const DEFAULT_ATTRIBUTES = [
    'placeholder',
    'title',
    'alt',
    'aria-label',
    'aria-description',
    'aria-placeholder',
    'label',
];

const noLiteralString = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Disallow hardcoded user-facing strings in JSX. Use t() or Trans.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    ignore: { type: 'array', items: { type: 'string' } },
                    ignoreAttributes: {
                        type: 'array',
                        items: { type: 'string' },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            literal:
                'Hardcoded string "{{text}}" is not translated. Use t() or Trans.',
        },
    },

    create(context) {
        const options = context.options[0] ?? {};
        const ignoredAttributes = new Set(
            options.ignoreAttributes ?? DEFAULT_ATTRIBUTES,
        );
        const ignore = new Set(options.ignore ?? []);
        const hasLetters = (value) => /\p{L}/u.test(value);
        const isAllowed = (value) => !hasLetters(value) || ignore.has(value);

        function insideTranslatable(node) {
            let current = node.parent;

            while (current) {
                if (current.type === 'JSXElement') {
                    const name = current.openingElement.name;
                    const tag =
                        name.type === 'JSXIdentifier'
                            ? name.name
                            : name.type === 'JSXMemberExpression'
                              ? name.property.name
                              : '';

                    if (['Trans', 'Translation', 'code', 'pre'].includes(tag)) {
                        return true;
                    }
                }

                current = current.parent;
            }

            return false;
        }

        function report(node, text) {
            context.report({
                node,
                messageId: 'literal',
                data: { text },
            });
        }

        function checkText(node, value) {
            const text = value.replace(/\s+/g, ' ').trim();

            if (!text || isAllowed(text) || insideTranslatable(node)) {
                return;
            }

            report(node, text);
        }

        return {
            JSXText(node) {
                checkText(node, node.value);
            },

            JSXExpressionContainer(node) {
                if (node.parent?.type === 'JSXAttribute') {
                    return;
                }

                const expression = node.expression;
                let value = null;

                if (
                    expression.type === 'Literal' &&
                    typeof expression.value === 'string'
                ) {
                    value = expression.value;
                } else if (
                    expression.type === 'TemplateLiteral' &&
                    expression.expressions.length === 0
                ) {
                    value = expression.quasis[0].value.cooked;
                }

                if (value !== null) {
                    checkText(expression, value);
                }
            },

            JSXAttribute(node) {
                if (
                    node.name.type !== 'JSXIdentifier' ||
                    !ignoredAttributes.has(node.name.name)
                ) {
                    return;
                }

                const value = literalString(node.value);

                if (value !== null) {
                    checkText(node.value, value);
                }
            },
        };
    },
};

const plugin = {
    meta: { name: 'eslint-plugin-i18n' },
    rules: {
        'no-missing-key': noMissingKey,
        'no-literal-string': noLiteralString,
    },
};

export default plugin;
