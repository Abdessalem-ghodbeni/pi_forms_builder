import express from "express";
import { AddForms } from "../controllers/forms.controller.js";

const router = express.Router();

router.post("/add_forms", AddForms);

export default router;
