import { Router } from "express";
import controller from "../controllers/userController.js";

const router = Router();

router.post("/register", controller.registration);
router.post("/login", controller.login);
router.get("/one", controller.getOne);

export default router;
