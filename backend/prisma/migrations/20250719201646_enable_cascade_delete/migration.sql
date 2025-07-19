-- DropForeignKey
ALTER TABLE "Estimate" DROP CONSTRAINT "Estimate_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Estimate" ADD CONSTRAINT "Estimate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
