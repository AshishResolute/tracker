-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Applied', 'Interview', 'Rejected', 'Ghosted', 'Offer', 'Recruiter_screen');

-- CreateTable
CREATE TABLE "ApplicationDetails" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'Applied',
    "interview_stage" TEXT DEFAULT 'First_Round',

    CONSTRAINT "ApplicationDetails_pkey" PRIMARY KEY ("id")
);
