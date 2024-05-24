import { Router } from "express";
import controller from "../controllers/postController.ts";

const router = Router();

router.post("/create", controller.createPost);
router.get("/all", controller.getAll);
router.get("/one", controller.getOne);

export default router;