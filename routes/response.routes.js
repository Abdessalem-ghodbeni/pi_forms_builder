import Express from "express";
import {
  addResponse,
  updateResponse,
} from "../controllers/Reponse.Controller.js";

const router = Express.Router();

router.post("/add", addResponse);
router.put("/update/:id", updateResponse);

export default router;
