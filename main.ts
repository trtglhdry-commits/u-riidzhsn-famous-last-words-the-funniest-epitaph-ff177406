/**
 * Famous Last Words: The Funniest Epitaph
 * (make.fun bounty u-riidzhsn-famous-last-words-the-funniest-epitaph-ff177406)
 *
 * Writes the single funniest one-line tombstone epitaph of famous last words
 * to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
 *
 * Deterministic: no randomness, no network, no clock. The entry is a fixed
 * string; a runtime guard enforces the competition gate before writing —
 * one line, 1-150 characters, not only white space. The read-back check
 * after the write guarantees the file on disk is exactly the gated line.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I died doing what I loved: ignoring the check engine light.";

function gateCheck(line: string): void {
  if (line.length < 1 || line.length > 150) {
    throw new Error(`entry must be 1-150 characters, got ${line.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  gateCheck(LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");
  // Post-write read-back: the file on disk must be exactly the gated line.
  const written = readFileSync(outPath, "utf8");
  if (written !== LINE + "\n") {
    throw new Error("read-back mismatch: entry.txt does not match the gated line");
  }
  gateCheck(written.replace(/\n$/, ""));
  console.log(`wrote ${LINE.length}-char entry to ${outPath}`);
}

main();
