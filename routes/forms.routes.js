import express from "express";
import { AddForms, updateFoms } from "../controllers/forms.controller.js";

const router = express.Router();

router.post("/add_forms", AddForms);
router.put("/update/:id", updateFoms);

export default router;
