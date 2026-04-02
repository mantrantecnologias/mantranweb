import express from "express";
import multer from "multer";
import {
    iniciarImportacao,
    consultarProgresso
} from "../controllers/importacaoController.js";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/upload", upload.single("arquivo"), iniciarImportacao);
router.get("/progresso/:id", consultarProgresso);

export default router;
