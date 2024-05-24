-- CreateTable
CREATE TABLE
    "posts" (
        "id" SERIAL NOT NULL,
        "created_by" INTEGER NOT NULL,
        "post" TEXT NOT NULL,
        CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "users" (
        "id" SERIAL NOT NULL,
        "username" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "hashed_password" VARCHAR(255) NOT NULL,
        "refresh_token" VARCHAR(255) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;