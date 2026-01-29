-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'BIDDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "JobUrgency" AS ENUM ('ASAP', 'THIS_WEEK', 'FLEXIBLE');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "urgency" "JobUrgency" NOT NULL DEFAULT 'FLEXIBLE',
    "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
    "locationAddr" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationArea" TEXT,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLng" DOUBLE PRECISION NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'HUF',
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDate" TIMESTAMP(3),
    "maxBids" INTEGER NOT NULL DEFAULT 10,
    "expiresAt" TIMESTAMP(3),
    "acceptedBidId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "proId" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'PENDING',
    "proposedPrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'HUF',
    "estimatedDuration" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "availableFrom" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_acceptedBidId_key" ON "jobs"("acceptedBidId");

-- CreateIndex
CREATE INDEX "jobs_customerId_idx" ON "jobs"("customerId");

-- CreateIndex
CREATE INDEX "jobs_category_idx" ON "jobs"("category");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_locationLat_locationLng_idx" ON "jobs"("locationLat", "locationLng");

-- CreateIndex
CREATE INDEX "jobs_createdAt_idx" ON "jobs"("createdAt");

-- CreateIndex
CREATE INDEX "bids_jobId_idx" ON "bids"("jobId");

-- CreateIndex
CREATE INDEX "bids_proId_idx" ON "bids"("proId");

-- CreateIndex
CREATE INDEX "bids_status_idx" ON "bids"("status");

-- CreateIndex
CREATE UNIQUE INDEX "bids_jobId_proId_key" ON "bids"("jobId", "proId");

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_proId_fkey" FOREIGN KEY ("proId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_proId_fkey" FOREIGN KEY ("proId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_acceptedBidId_fkey" FOREIGN KEY ("acceptedBidId") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_proId_fkey" FOREIGN KEY ("proId") REFERENCES "pro_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
