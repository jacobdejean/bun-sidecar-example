# bun-sidecar-example

This example is demonstrating two-way communication between a Tauri front-end and a compiled Bun shell script. 

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

Reference `build-bun.ts` for full context, but in a nutshell this script:
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

## Embedding other files

To embed files directly in the Bun binary, simply import the resource. 
https://bun.sh/docs/bundler/executables#embedding-files

To include files in Tauri's bundle, you can reference the resources in `tauri.conf.json`. 
https://tauri.app/v1/guides/building/resources
