import Express from "express";
import { addResponse } from "../controllers/Reponse.Controller.js";

const router = Express.Router();

router.post("/add", addResponse);

export default router;
