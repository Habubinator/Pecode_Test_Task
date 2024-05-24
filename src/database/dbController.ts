import { PrismaClient } from "@prisma/client";
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
            include: { posts: true },
        });
    }

    async getUserById(id: number) {
        return await prisma.users.findUnique({
            where: { id: id },
            include: { posts: true },
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

    async createPost(post: { created_by: number; post: string }) {
        return await prisma.posts.create({
            data: {
                created_by: post.created_by,
                post: post.post,
            },
        });
    }

    async getPosts() {
        return await prisma.posts.findMany();
    }
}

export default new DatabaseController();
