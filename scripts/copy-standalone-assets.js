// next build (output: "standalone") traces server code + prod deps into
// .next/standalone but does not copy static assets or public files in.
// Azure deploy ships .next/standalone as-is, so those need to be present here.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  throw new Error(".next/standalone not found — did `next build` run with output: \"standalone\"?");
}

fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
});
fs.cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});
