import { $ } from "bun";

const binaryName = "bun-sidecar";

// clean old build
await $`rm -rf ./bin`;
await $`mkdir ./bin`;

// compile typescript module
const build =
  await $`bun build ./src-bun/index.ts --compile --outfile ./bin/${binaryName}`;

// append machine triple to binary
if (build.exitCode === 0) {
  for await (const line of $`rustc -vV`.lines()) {
    const [key, value] = line.split(":");
    const isHostKey = key === "host";
    isHostKey && appendTargetTriple(value.trim());
  }
}

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
