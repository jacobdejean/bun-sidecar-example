import { $ } from "bun";

// Bun.argv includes raw args passed to process,
// our args are at the end
// [ "bun", "/$bunfs/root/bun-sidecar", "asdf" ]
const args = Bun.argv;

const message = args[args.length - 1];

if (!message) {
  await $`echo "No message provided!`;
} else {
  await $`echo "Message: ${message}"`;
}
