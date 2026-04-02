import express from "express";
import cors from "cors";
import importacaoRoutes from "./routes/importacaoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/importacao", importacaoRoutes);

app.listen(4000, () => console.log("API rodando na porta 4000"));
