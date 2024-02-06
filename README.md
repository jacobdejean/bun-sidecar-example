# bun-sidecar-example

This example is demonstrating two-way communication between a Tauri front-end and a compiled Bun shell script. 

Bun does many things, so it's important to clarify how it is being used in this example. Bun is being used as a:
* package manager
* compiler
* runtime*

*When running `bun run tauri dev` you are not getting the bun runtime. You are getting Bun to execute the dev script. In this example, the runtime is limited to the `src-bun/index.ts` module and the `tooling/build-bun.ts` script.

To run the dev server with Bun runtime, you would need to include the `--bun` flag unless otherwise indicated via `#!/usr/bin/env bun`. This does not appear to be compatible with Tauri, and would be pretty useless anyway. 

## Project structure

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

If you change the name of the binary in `package.json`, you must also change the name in `tauri.conf.json` See https://tauri.app/v1/guides/building/sidecar/

## Compiling

Read `build-bun.ts` for full context, but in a nutshell this script:
* Cleans `bin`
* Compiles typescript module with `bun build`
* Appends the build machine target triple to output binary using info from `rustc -vV`

Appending the triple is a cross-platform requirement of Tauri. Eg. `bin/bun-sidecar` becomes `bin/bun-sidecar-aarch64-apple-darwin` on Apple Silicon. 


### Windows

As of writing, Bun does not compile to a Windows target. Regardless, the build script will append `.exe` to Windows-built binaries as support is on the horizon.

## Usage
To call the sidecar from the front-end, use Tauri's `process-command-api` 

```ts
const command = Command.sidecar("../bin/bun-sidecar", [message]);
const output = await command.execute();
```

Tauri also supports invoking sidecars from Rust, you can find a code snippet here:
https://tauri.app/v1/guides/building/sidecar/#running-it-from-rust

In this example, we are passing a message to the script. If you run `bun run tauri dev`, greet the app with a name and you see the script's response appear below Rust's greeting. 

### Performance
Along with the echo, the execution time is displayed. Performance-wise, on a M2 Mac Mini, I see an average first-call of ~90ms and ~25ms subsequent calls. My assumption here is that Tauri does not load the binary into memory until `Command.sidecar` is called, resulting in extra time reading the file system. 

For comparison, I have not personally tested the execution time of a node module compiled with `pkg`. Once I test this I will update this section. Either way, the benefit of using Bun here is not limited to its performance. 


## Embedding other files

To embed files directly in the Bun binary, simply import the resource. 
https://bun.sh/docs/bundler/executables#embedding-files

To include files in Tauri's bundle, you can reference the resources in `tauri.conf.json`. 
https://tauri.app/v1/guides/building/resources
