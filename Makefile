.DEFAULT_GOAL := help

.PHONY: help install dev build preview check check-html check-source test test-python papers-download papers-check

help:
	@printf '%s\n' \
	  'make install         Install locked Node and Python dependencies' \
	  'make dev             Start the development server' \
	  'make build           Build and validate static output' \
	  'make preview         Serve the existing production build' \
	  'make check           Run all validation, tests, and build' \
	  'make check-html      Validate Portal HTML and test the Python validator' \
	  'make check-source    Check and build the frontend' \
	  'make test            Run Python and Node tests' \
	  'make test-python     Run Python tests' \
	  'make papers-download Download and verify Atlas research PDFs' \
	  'make papers-check    Verify cached PDFs without downloading'

install:
	pnpm install --frozen-lockfile
	uv sync --locked

dev build preview:
	pnpm $@

check:
	pnpm check

check-html:
	uv run --locked python scripts/check.py
	$(MAKE) test-python

check-source:
	pnpm check:source

test:
	$(MAKE) test-python
	pnpm test

test-python:
	uv run --locked python -m unittest discover -s tests

papers-download:
	pnpm papers:download

papers-check:
	pnpm papers:check
