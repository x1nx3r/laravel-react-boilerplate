SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help setup install dev test lint format typecheck build db-create-postgres

help:
	@printf '%s\n' \
	  'setup                Install deps, prepare .env, migrate/seed, and build frontend' \
	  'dev                  Run PHP server, queue listener, Vite, and preview proxy' \
	  'test                 Create the test DB and run PHPUnit against Postgres' \
	  'lint                 Check PHP, frontend formatting, and TypeScript' \
	  'format               Apply PHP and frontend formatting' \
	  'typecheck            Run TypeScript checks' \
	  'build                Build frontend assets' \
	  'db-create-postgres   Create the dev and test databases if absent'

install:
	composer install --no-interaction --prefer-dist
	npm ci

setup: install db-create-postgres
	@if [ ! -f .env ]; then cp .env.example .env; fi
	php artisan key:generate --ansi
	php artisan migrate --seed --force
	npm run build

dev:
	composer dev

test: db-create-postgres
	@if [ ! -f .env ]; then cp .env.example .env; fi
	php artisan test

db-create-postgres:
	@for db in laravel_boilerplate laravel_boilerplate_test; do \
	  PGPASSWORD=$${DB_PASSWORD:-postgres} psql -h $${DB_HOST:-127.0.0.1} -p $${DB_PORT:-5432} -U $${DB_USERNAME:-postgres} -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$$db'" | grep -q 1 || \
	    PGPASSWORD=$${DB_PASSWORD:-postgres} createdb -h $${DB_HOST:-127.0.0.1} -p $${DB_PORT:-5432} -U $${DB_USERNAME:-postgres} $$db; \
	done

lint:
	composer test:lint
	npm run lint:check
	npm run lint:i18n
	npm run format:check
	npm run types

format:
	composer lint
	npm run format

typecheck:
	npm run types

build:
	npm run build
