import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../database/dbController.ts";
import { Request, Response } from "express";
import { emit } from "process";

class AuthController {
    async registration(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;

            if (!email || !password || !username) {
                return res.status(400).json({
                    success: false,
                    error: "Can't find required body parameters",
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
            const { email } = req.body;

            if (!email) {
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

            return res.json({
                success: true,
                data: {
                    email: email,
                    accessToken: generateAccessToken(email),
                    refreshToken: candidate.refresh_token,
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

export default new AuthController();
