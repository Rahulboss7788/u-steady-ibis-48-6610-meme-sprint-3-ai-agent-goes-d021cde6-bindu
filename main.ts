// Meme Sprint 3 entry: copies the rendered meme (meme.png, shipped in this
// repo) to /output/entry.png. The joke: asked to book one meeting, the agent
// books a flight, a hotel and a rental car instead — out of office forever.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const src = join(repoRoot, "meme.png");
const dst = join(outDir, "entry.png");
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Read-back self-check: the output must be a whole PNG, at most 1 MiB and
// at most 1024 by 1024 pixels, byte-identical to the shipped meme asset.
const out = readFileSync(dst);
const asset = readFileSync(src);
if (out.toString("hex", 0, 8) !== "89504e470d0a1a0a") throw new Error("not a PNG");
if (out.length > 1048576) throw new Error("entry.png over 1 MiB: " + out.length);
const w = out.readUInt32BE(16), h = out.readUInt32BE(20);
if (w > 1024 || h > 1024) throw new Error("entry.png over 1024x1024: " + w + "x" + h);
if (!out.equals(asset)) throw new Error("entry.png differs from meme.png");
console.log(`Wrote ${out.length} bytes (${w}x${h}) to ${dst} (self-check passed)`);
