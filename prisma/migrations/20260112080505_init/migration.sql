-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_verifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "otp_code" TEXT NOT NULL,
    "otp_expiry" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "room_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "seeker_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("room_id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "message_id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_verifications_user_id_key" ON "user_verifications"("user_id");

-- CreateIndex
CREATE INDEX "chat_rooms_shop_id_idx" ON "chat_rooms"("shop_id");

-- CreateIndex
CREATE INDEX "chat_rooms_seeker_id_idx" ON "chat_rooms"("seeker_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_rooms_post_id_seeker_id_key" ON "chat_rooms"("post_id", "seeker_id");

-- CreateIndex
CREATE INDEX "chat_messages_room_id_created_at_idx" ON "chat_messages"("room_id", "created_at");

-- AddForeignKey
ALTER TABLE "user_verifications" ADD CONSTRAINT "user_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "shop_job_posts"("post_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("shop_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms" ADD CONSTRAINT "chat_rooms_seeker_id_fkey" FOREIGN KEY ("seeker_id") REFERENCES "job_seeker_profiles"("seeker_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
