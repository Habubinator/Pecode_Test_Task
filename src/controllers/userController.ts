import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../database/dbController.js";
import { Request, Response } from "express";

interface IJwt {
    email: string;
}

class UserController {
    async registration(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({
                    success: false,
                    error: "Can't find required body parameters",
                });
            }
            const emailRegEx =
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!emailRegEx.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: "User email is not valid",
                });
            }

            const candidate = await db.getUser(email);
            if (candidate) {
                return res.status(409).json({
                    success: false,
                    error: "User already exists",
                });
            }

            const hashPassword = bcrypt.hashSync(
                password,
                bcrypt.genSaltSync(10)
            );
            const refreshToken = generateRefreshToken();
            const accessToken = generateAccessToken(email);

            await db.createUser({
                email,
                username,
                hashPassword,
                refreshToken,
            });

            res.json({
                success: true,
                data: {
                    email: email,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Registration error",
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    error: "Can't find required body parameters",
                });
            }

            const candidate = await db.getUser(email);

            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: "Can't find user",
                });
            }

            if (bcrypt.compareSync(password, candidate.hashed_password)) {
                const accessToken = generateAccessToken(email);
                const refreshToken = generateRefreshToken();

                db.rewokeToken(email, refreshToken);

                return res.json({
                    success: true,
                    data: {
                        email: email,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    },
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Login error",
            });
        }
    }

    async getOne(req: Request, res: Response) {
        try {
            const { id } = req.body;

            const user: IJwt = res.locals.decoded;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Error: Login token is expired or not provided. Access denied.",
                });
            }

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: "Can't find required body parameters",
                });
            }

            const candidate = await db.getUserById(id);
            if (!candidate) {
                return res.status(404).json({
                    success: false,
                    error: "Can't find user",
                });
            }

            return res.json({
                success: true,
                data: {
                    candidate,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Error while getting user",
            });
        }
    }
}

function generateAccessToken(email: string): string {
    const payload = {
        email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_TTL,
    });
}

function generateRefreshToken(): string {
    return jwt.sign(
        crypto.randomBytes(32).toString("hex"),
        process.env.JWT_SECRET_KEY
    );
}

export default new UserController();
