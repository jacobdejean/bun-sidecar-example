import { $ } from "bun";

const args = Bun.argv;

await $`echo "Message: ${args.join(" ")}"`;

const messageArg = args.find((arg) => arg.startsWith("--message"));
const message = messageArg?.split("=")[1];

if (!message) {
  await $`echo "No message provided!`;
} else {
  await $`echo "Message: ${message}"`;
}
