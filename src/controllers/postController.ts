import db from "../database/dbController.ts";
import { Request, Response } from "express";

interface IJwt {
    email: string;
}

class PostController {
    async createPost(req: Request, res: Response) {
        try {
            const { post } = req.body;

            const user: IJwt = res.locals.decoded;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Error: Login token is expired or not provided. Access denied.",
                });
            }

            if (!post) {
                return res.status(400).json({
                    success: false,
                    error: "Can't find required body parameters",
                });
            }

            const candidate = await db.getUser(user.email);
            if (candidate) {
                const userPost = await db.createPost({
                    created_by: candidate.id,
                    post,
                });
                return res.json({
                    success: true,
                    data: { userPost },
                });
            }
            return res.status(400).json({
                success: false,
                error: "Can't find user by that token",
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Registration error",
            });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const user: IJwt = res.locals.decoded;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Error: Login token is expired or not provided. Access denied.",
                });
            }
            return res.json({
                success: true,
                data: await db.getPosts(),
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Login error",
            });
        }
    }
}

export default new PostController();
