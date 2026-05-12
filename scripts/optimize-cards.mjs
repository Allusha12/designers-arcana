#!/usr/bin/env node
// One-shot card image optimizer.
//
// Input:  public/cards/*.png  (3–4 MB each, source illustrations)
// Output: public/cards/*.avif (~400–600 KB each, 1500×2384 q88)
//
// The originals are backed up to public/cards-original/ (gitignored) before
// being replaced — re-run `npm run optimize-cards -- --restore` to roll back.
//
// Flags:
//   --dry         Print what would happen, don't write
//   --test        Process only 3 sample cards (card-01, card-16, card-32)
//   --restore     Move public/cards-original/* back into public/cards/

import sharp from "sharp";
import { readdir, mkdir, copyFile, rename, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CARDS_DIR = join(ROOT, "public", "cards");
const BACKUP_DIR = join(ROOT, "public", "cards-original");

// Target: 1500×2384 @ q88 AVIF.
// 1500 ÷ 2384 ≈ 0.629 — matches the 374:594 card aspect ratio exactly.
const TARGET_WIDTH = 1500;
const TARGET_HEIGHT = 2384;
const AVIF_QUALITY = 88;

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const TEST = args.has("--test");
const RESTORE = args.has("--restore");

const TEST_SAMPLES = ["advokat.png", "samoid.png", "babosiku.png"];

function fmtBytes(n) {
  if (n > 1024 * 1024) return `${(n / 1024 / 1024).toFixed(2)} MB`;
  if (n > 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${n} B`;
}

async function restore() {
  if (!existsSync(BACKUP_DIR)) {
    console.error(`No backup at ${BACKUP_DIR}`);
    process.exit(1);
  }
  const files = await readdir(BACKUP_DIR);
  for (const f of files) {
    const src = join(BACKUP_DIR, f);
    const dest = join(CARDS_DIR, f);
    // Drop any .avif produced earlier (matching same basename).
    const baseAvif = join(CARDS_DIR, basename(f, extname(f)) + ".avif");
    if (existsSync(baseAvif)) {
      console.log(`rm ${basename(baseAvif)}`);
      if (!DRY) await rename(baseAvif, baseAvif + ".bak");
    }
    console.log(`restore ${f}`);
    if (!DRY) await copyFile(src, dest);
  }
  console.log("\nRestored. Reverse the data/cards.ts edits manually if you changed them.");
}

async function optimize() {
  if (!existsSync(BACKUP_DIR)) {
    console.log(`Creating backup at ${BACKUP_DIR}`);
    if (!DRY) await mkdir(BACKUP_DIR, { recursive: true });
  }

  const files = (await readdir(CARDS_DIR)).filter(
    (f) => f.endsWith(".png") && !f.endsWith(".bak")
  );
  const targets = TEST ? files.filter((f) => TEST_SAMPLES.includes(f)) : files;

  console.log(`Processing ${targets.length} file(s) → 1500×2384 AVIF q${AVIF_QUALITY}`);
  console.log(`Source dir: ${CARDS_DIR}`);
  console.log(`Backup dir: ${BACKUP_DIR}\n`);

  let totalIn = 0;
  let totalOut = 0;

  for (const file of targets) {
    const src = join(CARDS_DIR, file);
    const baseName = basename(file, extname(file));
    const avifOut = join(CARDS_DIR, `${baseName}.avif`);
    const backupCopy = join(BACKUP_DIR, file);

    const srcStat = await stat(src);
    totalIn += srcStat.size;

    if (DRY) {
      console.log(`[dry] ${file} (${fmtBytes(srcStat.size)}) → ${baseName}.avif`);
      continue;
    }

    // Back up the original if we haven't already.
    if (!existsSync(backupCopy)) {
      await copyFile(src, backupCopy);
    }

    // Compress: contain ensures we never crop; the source aspect already
    // matches 374:594, so contain is effectively a clean resize.
    await sharp(src)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: "cover", position: "center" })
      .avif({ quality: AVIF_QUALITY, effort: 5 })
      .toFile(avifOut);

    const outStat = await stat(avifOut);
    totalOut += outStat.size;
    const ratio = (1 - outStat.size / srcStat.size) * 100;

    console.log(
      `${file.padEnd(32)} ${fmtBytes(srcStat.size).padStart(10)} → ${fmtBytes(outStat.size).padStart(10)}  (-${ratio.toFixed(0)}%)`
    );
  }

  console.log("\n────────────────────────────────────────");
  console.log(`Total in:  ${fmtBytes(totalIn)}`);
  console.log(`Total out: ${fmtBytes(totalOut)}`);
  if (totalIn > 0) {
    console.log(`Saved:     ${fmtBytes(totalIn - totalOut)} (${((1 - totalOut / totalIn) * 100).toFixed(0)}%)`);
  }
}

(async () => {
  if (RESTORE) await restore();
  else await optimize();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
