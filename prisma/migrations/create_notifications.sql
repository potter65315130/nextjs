-- CreateTable: Notifications
CREATE TABLE IF NOT EXISTS "notifications" (
    "notification_id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "link" VARCHAR(500),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "application_id" INTEGER,
    "post_id" INTEGER,
    "chat_room_id" INTEGER
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_notifications_user_created" ON "notifications"("user_id", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_notifications_user_read" ON "notifications"("user_id", "is_read");
