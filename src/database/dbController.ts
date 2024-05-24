import { PrismaClient } from "@prisma/client/edge";
import { emit } from "process";
const prisma = new PrismaClient();

export interface IUser {
    email: string;
    username: string;
    hashPassword: string;
    refreshToken: string;
}

class DatabaseController {
    async getUser(email: string) {
        return await prisma.users.findUnique({
            where: { email: email },
        });
    }

    async createUser(user: IUser) {
        return await prisma.users.create({
            data: {
                email: user.email,
                username: user.username,
                hashed_password: user.hashPassword,
                refresh_token: user.hashPassword,
            },
        });
    }

    async rewokeToken(email: string, refreshToken: string): Promise<void> {
        await prisma.users.update({
            where: {
                email: email,
            },
            data: {
                refresh_token: refreshToken,
            },
        });
    }
}

export default new DatabaseController();
