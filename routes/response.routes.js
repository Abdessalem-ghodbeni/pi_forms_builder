import Express from "express";
import {
  addResponse,
  cloudinaryTest,
  updateResponse,
} from "../controllers/Reponse.Controller.js";
import { singleUpload } from "../middleware/multer.js";
const router = Express.Router();

router.post("/add", addResponse);
router.put("/update/:id", updateResponse);
router.post("/add_test", singleUpload, cloudinaryTest);

export default router;
