/**
 * Parses the data from the exported MongoDB data.
 *
 * @author Ken Verdadero
 * (c) 2024 MSDAC Systems
 */

import { Command } from "commander";
import fs from "fs";
import { HymnData, HymnDataRaw, MongoData } from "./types";

const program = new Command();
const headers = ["id", "queries", "launches", "lastAccessed"] as const;

/**
 * Returns the mapped hymnal data
 * @param hymnalData the raw hymnal data
 * @returns the mapped hymnal data
 */
function getMappedData(hymnalData: HymnDataRaw): HymnData[] {
  return Object.keys(hymnalData).map((id) => {
    const hymn = hymnalData[id];
    const queries =
      parseInt(hymn[0].$numberInt || "") > 0 ? hymn[0].$numberInt || "" : "";
    const launches =
      parseInt(hymn[1].$numberInt || "") > 0 ? hymn[1].$numberInt || "" : "";
    const lastAccessed = hymn[2].$numberDouble
      ? new Date(parseFloat(hymn[2].$numberDouble) * 1000)
          .toLocaleString()
          .replace(",", "")
      : "";

    return {
      id,
      queries,
      launches,
      lastAccessed,
    } satisfies HymnData;
  });
}

/**
 * Dump the data to a CSV file
 * @param data the hymnal data
 * @param file the file to write to
 * @param sort whether to sort the data by id
 */
function dumpToCSV(data: HymnData[], file: string, sort = true) {
  // Sort by id
  if (sort) {
    data.sort((a, b) => a.id.localeCompare(b.id));
  }

  const csv = data
    .map((row) => {
      return `${row.id},${row.queries},${row.launches},${row.lastAccessed}`;
    })
    .join("\n");
  // Append the header

  const header = `${headers.join(",")}\n`;
  fs.writeFileSync(file, header + csv, "utf-8");
}

program
  .version("0.0.1")
  .description(
    "A CSV exporter for MSDAC Systems Hymnal Browser data.\nMongoDB data must be exported as JSON.\nThe output file will be in CSV format.\n\n(c) 2024 MSDAC Systems",
  )
  .requiredOption(
    "-i, --input <file>",
    "Path to input file. Example: data.json",
  )
  .option(
    "-o, --output <file>",
    "Path to output file. Example: data.csv.",
    "output.csv",
  )
  .option("-s, --sort", "Sort the data by id.", true)
  .action((data: { input: string; output: string; sort: boolean }) => {
    const file = data.input;
    const output = data.output;
    const sort = data.sort;

    // Check if the file exists
    if (!fs.existsSync(file)) {
      console.error(`File '${file}' does not exist.`);
      process.exit(1);
    }

    const raw = fs.readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw) as MongoData;
    const hymnalData = parsed.PACKAGE.hymnal.DATA;
    const mappedData = getMappedData(hymnalData);
    dumpToCSV(mappedData, output, sort);
  });

program.parse(process.argv);
