#!/usr/bin/env php
<?php

/**
 * Rename the boilerplate for a new project.
 *
 * Usage: php bin/rename.php "Client App Name" [composer-slug]
 */
if ($argc < 2) {
    fwrite(STDERR, "Usage: php bin/rename.php \"App Name\" [composer-slug]\n");

    exit(1);
}

$name = $argv[1];
$slug = $argv[2] ?? strtolower(trim((string) preg_replace('/[^A-Za-z0-9]+/', '-', $name), '-'));
$base = dirname(__DIR__);

$composerFile = $base.'/composer.json';

if (! file_exists($composerFile)) {
    fwrite(STDERR, "composer.json not found.\n");

    exit(1);
}

$composer = json_decode((string) file_get_contents($composerFile), true, flags: JSON_THROW_ON_ERROR);
$composer['name'] = 'laravel/'.$slug;
$composer['description'] = $name.' application skeleton.';

file_put_contents(
    $composerFile,
    json_encode($composer, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE).PHP_EOL,
);

echo "Updated: composer.json\n";

foreach (['.env', '.env.example'] as $envFile) {
    $path = $base.'/'.$envFile;

    if (! file_exists($path)) {
        continue;
    }

    $contents = (string) file_get_contents($path);
    $contents = preg_replace('/^APP_NAME=.*$/m', 'APP_NAME="'.$name.'"', $contents);

    file_put_contents($path, $contents);

    echo "Updated: {$envFile}\n";
}

echo PHP_EOL."Done. Next steps:\n";
echo '  composer setup'.PHP_EOL;
echo '  composer dev'.PHP_EOL;
