# Attention Atlas research papers

The [research notes](../RESEARCH.md) define model dimensions, layer schedules, source sections, and scientific caveats. The [paper manifest](papers.json) pins download URLs, revisions, byte sizes, and SHA-256 checksums. PDFs are local research copies in the Git-ignored `papers/` directory; the website links to publishers rather than redistributing them.

## Download and verify

Use the repository toolchain and `curl`. From the repository root:

```sh
make papers-download
make papers-check
```

| Paper ID | File inside `papers/` |
| --- | --- |
| `transformer` | `Attention_Is_All_You_Need.pdf` |
| `deepseek` | `DeepSeek_V41_Tech_Report.pdf` |

Use pnpm to pass selection or refresh options:

```sh
pnpm papers:download --paper transformer
pnpm papers:download --paper deepseek --force
pnpm papers:check --paper deepseek
```

## Cache and failure behavior

- Normal runs verify cached files and download only missing or invalid copies. `--check` performs no network requests or writes and fails if a selected file is missing or invalid.
- Downloads require HTTPS and use bounded retries, timeouts, and file sizes. `curl` uses its standard environment-based proxy configuration.
- PDF headers, byte sizes, and SHA-256 must match, including with `--force`. Verified temporary files replace destinations atomically; failures preserve existing files and remove temporary downloads.
- `--check` and `--force` are mutually exclusive. Invalid options fail before downloading. Paths resolve relative to the script, independently of the current working directory.
- Review source changes and scientific implications before updating the manifest and research notes. Downloads never update the baseline automatically.

`pnpm test` runs offline downloader regression tests with synthetic PDF fixtures. `make papers-check` validates the actual local research copies against the manifest.
