import { Router } from "express";
import controller from "../controllers/postController.js";

const router = Router();

router.post("/create", controller.createPost);
router.get("/all", controller.getAll);

export default router;
