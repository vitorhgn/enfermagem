// server.js
import app from "./src/app.js";
import db from "./src/models/index.js";

const PORT = process.env.PORT || 5380;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
