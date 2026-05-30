#!/usr/bin/env node
/**
 * Build frontend + serve SPA via FastAPI (mesmo fallback que produção).
 * Usado pelo Playwright (CRP-010).
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const frontend = path.join(root, "frontend");
const backend = path.join(root, "backend");
const dist = path.join(frontend, "dist");
const target = path.join(backend, "app", "static", "frontend");

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...opts,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exit ${code}`))));
    child.on("error", reject);
  });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const s = path.join(src, name);
    const d = path.join(dest, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function main() {
  await run("npm", ["run", "build"], { cwd: frontend });
  fs.rmSync(target, { recursive: true, force: true });
  copyDir(dist, target);

  const venvPython =
    process.platform === "win32"
      ? path.join(backend, ".venv", "Scripts", "python.exe")
      : path.join(backend, ".venv", "bin", "python");
  const python = fs.existsSync(venvPython) ? venvPython : "python";

  const e2eDbDir = path.join(backend, ".e2e-data");
  fs.mkdirSync(e2eDbDir, { recursive: true });
  const e2eDb = path.join(e2eDbDir, "playwright.db");
  const dbUrl = `sqlite:///${e2eDb.replace(/\\/g, "/")}`;

  if (!fs.existsSync(e2eDb)) {
    console.log("[e2e] Preparando SQLite:", e2eDb);
    await run(python, ["-m", "alembic", "upgrade", "head"], {
      cwd: backend,
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
    await run(python, ["-m", "app.db.seed"], {
      cwd: backend,
      env: { ...process.env, DATABASE_URL: dbUrl },
    });
  }

  const env = {
    ...process.env,
    DATABASE_URL: dbUrl,
    JWT_SECRET: process.env.JWT_SECRET || "e2e-jwt-secret",
    ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL || "admin@test.local",
    ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD || "e2e-password",
  };

  const uvicorn = spawn(
    python,
    ["-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "4173"],
    { cwd: backend, stdio: "inherit", env },
  );
  uvicorn.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
