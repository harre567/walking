// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 静的配信（public/ 配下）
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders(res, filePath) {
      // VRM/GLB/FBX の Content-Type を明示（ブラウザで誤判定されがち）
      if (filePath.endsWith(".vrm") || filePath.endsWith(".glb")) {
        res.setHeader("Content-Type", "model/gltf-binary");
      } else if (filePath.endsWith(".fbx")) {
        res.setHeader("Content-Type", "application/octet-stream");
      }
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

// SPA想定：未知のパスは index.html を返す
app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000; // Render は PORT を割り当てます
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
