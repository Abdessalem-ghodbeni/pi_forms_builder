import express from "express";
import {
  AddForms,
  DeleteForm,
  retrieveAllForms,
  updateFormWithFields,
} from "../controllers/forms.controller.js";

const router = express.Router();

router.post("/add_forms", AddForms);

router.put("/update/:id", updateFormWithFields);
router.delete("/delete/:id", DeleteForm);
router.get("/get/all", retrieveAllForms);

export default router;
