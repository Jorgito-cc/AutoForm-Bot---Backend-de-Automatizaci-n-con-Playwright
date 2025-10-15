// server.js
import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let currentProcess = null;

// 🚀 Ejecutar bot
app.post("/run-bot", (req, res) => {
  const { formUrl, cantidad } = req.body;

  if (currentProcess) {
    res.write("⚠️ Ya hay un proceso activo. Espera o cancélalo.\n");
    res.end();
    return;
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  console.log(`🧩 Ejecutando bot con: ${formUrl} (${cantidad} envíos)`);

  currentProcess = spawn("node", ["fill_form_playwright.js", formUrl, cantidad], {
    cwd: __dirname,
  });

  currentProcess.stdout.on("data", (data) => res.write(data));
  currentProcess.stderr.on("data", (data) => res.write(`⚠️ ${data}`));

  currentProcess.on("close", (code) => {
    res.write(`\n✅ Proceso finalizado con código ${code}\n`);
    res.end();
    currentProcess = null;
  });
});

// 🛑 Cancelar bot
app.post("/cancel-bot", (req, res) => {
  if (currentProcess) {
    console.log("🛑 Cancelando proceso...");
    currentProcess.kill("SIGTERM");
    currentProcess = null;
    res.json({ message: "Proceso cancelado correctamente." });
  } else {
    res.json({ message: "No hay proceso en ejecución." });
  }
});

// ✅ Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`);
});