import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { toDataUri, ValidationError } from "@aleburato/primeval";

const repoRoot = process.cwd();

function runModule(script) {
  return spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("package root import resolves", async () => {
  const mod = await import("@aleburato/primeval");
  assert.equal(typeof mod.approximate, "function");
  assert.equal(typeof mod.toDataUri, "function");
  assert.equal(typeof mod.ValidationError, "function");
  assert.equal(typeof mod.NotFoundError, "function");
  assert.equal(typeof mod.AbortError, "function");
});

test("toDataUri encodes svg results", () => {
  const uri = toDataUri({
    format: "svg",
    data: "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>",
    mimeType: "image/svg+xml",
    width: 1,
    height: 1,
  });

  assert.match(uri, /^data:image\/svg\+xml;base64,/);
  assert.equal(
    Buffer.from(uri.split(",")[1], "base64").toString("utf8"),
    "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>",
  );
});

test("toDataUri encodes raster results", () => {
  const uri = toDataUri({
    format: "png",
    data: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    mimeType: "image/png",
    width: 1,
    height: 1,
  });

  assert.match(uri, /^data:image\/png;base64,/);
  assert.equal(Buffer.from(uri.split(",")[1], "base64")[0], 0x89);
});

test("validation rejects missing input before native loading", () => {
  assert.throws(
    () => {
      toDataUri(/** @type {any} */ (null));
    },
    (err) => err instanceof ValidationError,
  );
});

test("approximate rejects non-function progress callbacks with ValidationError", () => {
  const result = runModule(`
    import { readFileSync } from "node:fs";
    import { approximate, ValidationError } from "@aleburato/primeval";
    const input = readFileSync("docs/readme/originals/monalisa.jpg");

    try {
      approximate({
        input: { kind: "bytes", data: input },
        output: "svg",
        render: { count: 2, resizeInput: 8, outputSize: 16, seed: 7 },
        execution: { onProgress: 123 },
      });
      console.log("NO_ERROR");
    } catch (error) {
      console.log(error instanceof ValidationError, error?.name, error?.message);
    }
  `);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    "true ValidationError execution.onProgress must be a function",
  );
});

test("approximate rejects invalid abort signals with ValidationError", () => {
  const result = runModule(`
    import { readFileSync } from "node:fs";
    import { approximate, ValidationError } from "@aleburato/primeval";
    const input = readFileSync("docs/readme/originals/monalisa.jpg");

    try {
      approximate({
        input: { kind: "bytes", data: input },
        output: "svg",
        render: { count: 1, resizeInput: 8, outputSize: 16, seed: 7 },
        execution: { signal: {} },
      });
      console.log("NO_ERROR");
    } catch (error) {
      console.log(error instanceof ValidationError, error?.name, error?.message);
    }
  `);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    result.stdout.trim(),
    "true ValidationError execution.signal must be an AbortSignal",
  );
});
