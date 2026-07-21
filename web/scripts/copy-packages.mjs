import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(webRoot, "../packages");
const target = path.resolve(webRoot, "packages");

fs.cpSync(source, target, { recursive: true });
console.log("Packages copied");
