import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const envPath = join(dirname(fileURLToPath(import.meta.url)), "..", ".env.local");
const envText = await readFile(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Missing Supabase env vars");

const BUCKET = "slideshow";
const ASSETS_DIR = "/Users/kory/Documents/Claude/Projects/Steph's Grad Party/slideshow-assets";

const supabase = createClient(url, key);

const files = (await readdir(ASSETS_DIR)).filter((f) => f.endsWith(".jpg")).sort();
console.log(`Uploading ${files.length} files to bucket "${BUCKET}"...`);

let ok = 0;
let fail = 0;
for (const file of files) {
  const body = await readFile(join(ASSETS_DIR, file));
  const { error } = await supabase.storage.from(BUCKET).upload(file, body, {
    contentType: "image/jpeg",
    upsert: true,
  });
  if (error) {
    console.error(`FAIL ${file}: ${error.message}`);
    fail++;
  } else {
    process.stdout.write(".");
    ok++;
  }
}
console.log(`\nDone. ok=${ok} fail=${fail}`);
