/*
  Warnings:

  - A unique constraint covering the columns `[proId,name]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_proId_name_key" ON "services"("proId", "name");
