-- AlterTable
ALTER TABLE "pro_profiles" ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStartedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" TEXT;
