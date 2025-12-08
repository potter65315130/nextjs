-- AlterTable
ALTER TABLE "shop_job_posts" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "shop_job_posts_latitude_longitude_idx" ON "shop_job_posts"("latitude", "longitude");
