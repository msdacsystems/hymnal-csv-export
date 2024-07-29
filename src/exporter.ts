/**
 * Parses the data from the exported MongoDB data.
 *
 * @author Ken Verdadero
 * (c) 2024 MSDAC Systems
 */

import { Command } from "commander";
import fs from "fs";
import {
  HymnData,
  HymnDataRaw,
  HymnalBrowserData,
  MongoHymnData,
} from "./types";

const program = new Command();
const headers = ["id", "queries", "launches", "lastAccessed"] as const;

/**
 * Returns the mapped hymnal data
 * @param hymnalData the raw hymnal data
 * @returns the mapped hymnal data
 */
function getMappedData(hymnalData: MongoHymnData | HymnDataRaw): HymnData[] {
  return Object.keys(hymnalData).map((id) => {
    const hymn = hymnalData[id];

    if (hymn.every((item) => typeof item === "object")) {
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
    }

    const [queries, launches, lastAccessed] = hymn;

    return {
      id,
      queries: queries.toString(),
      launches: launches.toString(),
      lastAccessed: lastAccessed
        ? new Date(lastAccessed * 1000).toLocaleString().replace(",", "")
        : "",
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
    "A CSV exporter for MSDAC Systems Hymnal Browser data.\nThe output file will be in CSV format.\n\n(c) 2024 MSDAC Systems",
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
  .option(
    "-r, --raw",
    "Indicate the input file is a raw JSON from Hymnal Browser.",
    false,
  )
  .option("-s, --sort", "Sort the data by id.", true)
  .action(
    (data: { input: string; output: string; sort: boolean; raw: boolean }) => {
      const { input: file, output, sort, raw } = data;

      // Check if the file exists
      if (!fs.existsSync(file)) {
        console.error(`File '${file}' does not exist.`);
        process.exit(1);
      }

      const rawFile = fs.readFileSync(file, "utf-8");
      const parsed = JSON.parse(rawFile);

      // Check if the input file is a MongoDB export
      if (!("PACKAGE" in parsed) && !data.raw) {
        console.error(
          "Invalid input file. PACKAGE is not found. If the input file is not a MongoDB export, use the --raw flag.",
        );
        process.exit(1);
      }

      // Process raw data
      if (data.raw) {
        if (!("DATA" in parsed)) {
          console.error("Invalid raw input file. No DATA key found.");
          process.exit(1);
        }
        const { DATA } = parsed as HymnalBrowserData;
        const mappedData = getMappedData(DATA);
        dumpToCSV(mappedData, output, sort);
        return;
      }

      const hymnalData = parsed.PACKAGE.hymnal.DATA as MongoHymnData;
      const mappedData = getMappedData(hymnalData);
      dumpToCSV(mappedData, output, sort ?? true);
    },
  );

program.parse(process.argv);
