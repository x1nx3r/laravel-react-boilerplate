import fs from 'node:fs';
import path from 'node:path';

/**
 * Checks the frontend locale bundles:
 *   1. every locale has the same key set (parity)
 *   2. every key is referenced from code (unused keys)
 *
 * Missing keys used in code are reported by the ESLint rule
 * `i18n/no-missing-key`; this script covers what a per-file rule cannot see.
 */

const root = process.cwd();
const localesDir = path.join(root, 'resources/js/i18n/locales');
const locales = ['en', 'id'];
const allowUnused = process.argv.includes('--allow-unused');

const SKIP_DIRS = new Set([
    'actions',
    'i18n',
    'node_modules',
    'routes',
    'ui',
    'wayfinder',
]);

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

function readLocale(locale) {
    const file = path.join(localesDir, `${locale}.json`);

    return flatten(JSON.parse(fs.readFileSync(file, 'utf8')));
}

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) {
                walk(path.join(dir, entry.name), files);
            }
        } else if (/\.(ts|tsx)$/.test(entry.name)) {
            files.push(path.join(dir, entry.name));
        }
    }

    return files;
}

function normalizeKey(key) {
    const normalized = key.startsWith('translation:')
        ? key.slice('translation:'.length)
        : key;

    return normalized.includes(':') ? null : normalized;
}

const used = new Set();
const dynamicPrefixes = new Set();

const STRING_CALL = /\bt\(\s*(['"])(.+?)\1/g;
const TEMPLATE_CALL = /\bt\(\s*`([^`]*)`/g;
const TRANS_KEY = /i18nKey=\{?\s*(['"])(.+?)\1/g;
// Keys can also be carried as data (navigation config, table column config)
// and resolved later with t(variable).
const STRING_LITERAL = /(['"])([A-Za-z0-9_.-]+)\1/g;

for (const file of walk(path.join(root, 'resources/js'))) {
    const source = fs.readFileSync(file, 'utf8');

    for (const match of source.matchAll(STRING_LITERAL)) {
        const key = normalizeKey(match[2]);

        if (key) {
            used.add(key);
        }
    }

    for (const match of source.matchAll(STRING_CALL)) {
        const key = normalizeKey(match[2]);

        if (key) {
            used.add(key);
        }
    }

    for (const match of source.matchAll(TRANS_KEY)) {
        const key = normalizeKey(match[2]);

        if (key) {
            used.add(key);
        }
    }

    for (const match of source.matchAll(TEMPLATE_CALL)) {
        const raw = match[1];

        if (raw.includes('${')) {
            dynamicPrefixes.add(raw.split('${')[0]);
        } else {
            const key = normalizeKey(raw);

            if (key) {
                used.add(key);
            }
        }
    }
}

const keys = Object.fromEntries(
    locales.map((locale) => [locale, readLocale(locale)]),
);

const isReferenced = (key) =>
    used.has(key) ||
    [...dynamicPrefixes].some((prefix) => key.startsWith(prefix));

let failed = false;

console.log(`i18n: ${keys.en.size} keys (en), ${keys.id.size} keys (id)`);

for (const [index, locale] of locales.entries()) {
    const reference = locales[index === 0 ? 1 : 0];
    const missing = [...keys[reference]].filter(
        (key) => !keys[locale].has(key),
    );

    if (missing.length > 0) {
        failed = true;
        console.error(`\n✖ ${locale}.json is missing ${missing.length} keys:`);

        for (const key of missing.sort()) {
            console.error(`    ${key}`);
        }
    }
}

if (!failed) {
    console.log('✔ locale key parity');
}

const unused = [...keys.en].filter((key) => !isReferenced(key)).sort();

if (unused.length > 0) {
    console.log(`\n⚠ ${unused.length} unused keys (en):`);

    for (const key of unused) {
        console.log(`    ${key}`);
    }

    if (!allowUnused) {
        failed = true;
    }
} else {
    console.log('✔ no unused keys');
}

process.exit(failed ? 1 : 0);
