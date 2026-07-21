import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bin = join(
	root,
	"pocketbase",
	process.platform === "win32" ? "pocketbase.exe" : "pocketbase"
);

const child = spawn(bin, process.argv.slice(2), { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
