#!/usr/bin/env tsimp
import process from "node:process";
import meow from "meow";

const cli = meow({ importMeta: import.meta });

console.log("input:", cli.input);
process.exit(0);
