#!/usr/bin/env bun

import appPackage from "../package.json";
import { $ } from "bun";

const module = appPackage.config["build:bun"].module;
const binaryName = appPackage.config["build:bun"].output;

// clean old build
await $`rm -rf ./bin`;
await $`mkdir ./bin`;

// compile typescript module
const binFile = `./bin/${binaryName}`;
const build = await $`bun build ${module} --compile --outfile ${binFile}`;

// append machine triple to binary
if (build.exitCode === 0) {
  for await (const line of $`rustc -vV`.lines()) {
    const [key, value] = line.split(":");
    const isHostKey = key === "host";
    isHostKey && appendTargetTriple(value.trim());
  }
}

// bun doesn't support Windows yet, but we're ready
async function appendTargetTriple(targetTriple: string) {
  const extension = getExtension();
  const existingBinary = `./bin/${binaryName}${extension}`;
  const targetBinary = `./bin/${binaryName}-${targetTriple}${extension}`;

  await $`mv ${existingBinary} ${targetBinary}`;

  console.log(`Renamed ${existingBinary} to ${targetBinary}`);
}

function getExtension() {
  return process.platform === "win32" ? ".exe" : "";
}
