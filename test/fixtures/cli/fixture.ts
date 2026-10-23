#!/usr/bin/env node
import process from "process";
import mrowki from "mrowki";

const cli = mrowki("Usage…", { pkg: { name: "cli" } });

console.log("input:", cli.input);
process.exit(0);
