/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Diagnosis` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Diagnosis" DROP CONSTRAINT "Diagnosis_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "name" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "public"."Diagnosis";

-- CreateTable
CREATE TABLE "DiagnosisRecord" (
    "id" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "diagnosisCode" INTEGER NOT NULL,
    "diagnosisLabel" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "rawPredictions" DOUBLE PRECISION[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiagnosisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiagnosisRecord_userId_idx" ON "DiagnosisRecord"("userId");

-- AddForeignKey
ALTER TABLE "DiagnosisRecord" ADD CONSTRAINT "DiagnosisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
