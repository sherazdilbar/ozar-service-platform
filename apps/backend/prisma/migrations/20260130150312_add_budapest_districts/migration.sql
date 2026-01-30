-- AlterTable
ALTER TABLE "pro_profiles" ADD COLUMN     "locationDistrict" TEXT,
ADD COLUMN     "serviceAreaDistricts" TEXT[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "locationDistrict" TEXT;
