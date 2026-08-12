import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  {
    name: "backend",
    command:
      process.platform === "win32"
        ? `${npmCommand} --prefix backend run dev`
        : npmCommand,
    args: process.platform === "win32" ? [] : ["--prefix", "backend", "run", "dev"],
  },
  {
    name: "frontend",
    command:
      process.platform === "win32" ? `${npmCommand} run dev:frontend` : npmCommand,
    args: process.platform === "win32" ? [] : ["run", "dev:frontend"],
  },
];

const running = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(`[${name}] exited with code ${code}`);
    }
  });

  return child;
});

function stopAll() {
  running.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });
}

process.on("SIGINT", () => {
  stopAll();
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll();
  process.exit(0);
});
