# bun-sidecar-example

This example is demonstrating two-way communication between a Tauri front-end and a compiled Bun shell script. 

Bun does many things, so it's important to clarify how it is being used in this example. Bun is being used as a:
* package manager
* compiler
* runtime*

*When running `bun run tauri dev` you are not getting the bun runtime. You are getting the Bun PM to execute the dev script. In this example, the runtime is limited to the `src-bun/index.ts` module and the `tooling/build-bun.ts` script.

To run the dev server with Bun runtime, you would need to include the `--bun` flag unless otherwise indicated via `#!/usr/bin/env bun`. This does not appear to be compatible with Tauri, and would be pretty useless anyway. 

# Project structure

This project is identical to the boilerplate produced by `bun create tauri@latest` with the addition of:
* /bin/
* /src-bun/index.ts
* /tooling/build-bun.ts

The following has been added to `package.json` to support the `build-bun` script:
```json
"scripts": {
    "build:bun": "bun run ./tooling/build-bun.ts"
},
"config": {
    "build:bun": {
      "module": "./src-bun/index.ts",
      "output": "bun-sidecar"
    }
}
```

`tauri.conf.json` has also been modified to support external binaries. See https://tauri.app/v1/guides/building/sidecar/

