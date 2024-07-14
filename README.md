# Hymnal Browser Data Exporter

A CLI for exporting MongoDB data from the [Hymnal Browser](https://github.com/msdacsystems/hymnalbrowser) database to a CSV file.

## Usage

1. Download the executable from the [releases page](https://github.com/msdacsystems/hymnal-csv-export/releases).
2. Run the exporter. Use `exporter --help` to see the available options.

## Options

- `-i` `--input`: The input file path. Must be a valid MongoDB JSON file.
- `--o` `--output`: The output file path. Default is `output.csv`.
- `-s` `--sort`: Sort by ID. Default is `False`.

## Building from source

1. Clone the repository
2. Install the required dependencies using `bun i`
3. To build an executable, run the following command:

```bash
bun build src/exporter.ts --minify --compile --outfile dist/exporter
```

See the [Bundler documentation](https://bun.sh/docs/bundler/executables) for more information.

---

© 2024 MSDAC Systems
