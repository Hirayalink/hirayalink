-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PLEDGED', 'COLLECTED', 'PROCESSING', 'IN_TRANSIT', 'RECEIVED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "barangayId" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orgName" TEXT,
    "contactNumber" TEXT NOT NULL,
    "address" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarangayRequestPost" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "typeOfCalamity" TEXT NOT NULL,
    "inKind" JSONB NOT NULL,
    "specifications" JSONB NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "dropOffAddress" TEXT NOT NULL,
    "dropOffLandmark" TEXT NOT NULL,
    "image" BYTEA,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batchNumber" INTEGER NOT NULL,
    "barangayId" TEXT,

    CONSTRAINT "BarangayRequestPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barangayRequestPostId" TEXT,
    "recipientRequestPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "barangayRequestPostId" TEXT,
    "recipientRequestPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "description" TEXT,
    "donationIds" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipientRequestPost" (
    "id" TEXT NOT NULL,
    "completeName" VARCHAR(191) NOT NULL,
    "age" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "noOfFamilyMembers" INTEGER NOT NULL,
    "contactNumber" VARCHAR(191) NOT NULL,
    "emailAddress" VARCHAR(191),
    "typeOfCalamity" VARCHAR(191) NOT NULL,
    "inKindNecessities" TEXT NOT NULL,
    "specifications" TEXT NOT NULL,
    "uploadedPhoto" BYTEA,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "barangayId" TEXT,

    CONSTRAINT "RecipientRequestPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "controlNumber" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "barangayId" TEXT NOT NULL,
    "donationStatus" "DonationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barangayRequestPostId" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationItem" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "DonationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationStatusLog" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "status" "DonationStatus" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,

    CONSTRAINT "DonationStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Barangay" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Barangay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL,
    "area" VARCHAR(191),
    "barangayId" TEXT,
    "nameOfCalamity" VARCHAR(191),
    "controlNumber" VARCHAR(191),
    "transactionIds" TEXT,
    "batchNumber" VARCHAR(191),
    "numberOfRecipients" INTEGER,
    "storyText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" BYTEA,

    CONSTRAINT "SuccessStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calamityImpact" (
    "id" TEXT NOT NULL,
    "barangayId" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "nameOfCalamity" TEXT NOT NULL,
    "storyText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" BYTEA,

    CONSTRAINT "calamityImpact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_name_key" ON "Admin"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_contactNumber_key" ON "Admin"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_name_key" ON "Donor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_contactNumber_key" ON "Donor"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_barangayRequestPostId_key" ON "Like"("userId", "barangayRequestPostId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_recipientRequestPostId_key" ON "Like"("userId", "recipientRequestPostId");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_batchNumber_key" ON "Batch"("batchNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_controlNumber_key" ON "Donation"("controlNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Barangay_name_key" ON "Barangay"("name");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarangayRequestPost" ADD CONSTRAINT "BarangayRequestPost_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_barangayRequestPostId_fkey" FOREIGN KEY ("barangayRequestPostId") REFERENCES "BarangayRequestPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_recipientRequestPostId_fkey" FOREIGN KEY ("recipientRequestPostId") REFERENCES "RecipientRequestPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_barangayRequestPostId_fkey" FOREIGN KEY ("barangayRequestPostId") REFERENCES "BarangayRequestPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_recipientRequestPostId_fkey" FOREIGN KEY ("recipientRequestPostId") REFERENCES "RecipientRequestPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipientRequestPost" ADD CONSTRAINT "RecipientRequestPost_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_barangayRequestPostId_fkey" FOREIGN KEY ("barangayRequestPostId") REFERENCES "BarangayRequestPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationItem" ADD CONSTRAINT "DonationItem_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationStatusLog" ADD CONSTRAINT "DonationStatusLog_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessStory" ADD CONSTRAINT "SuccessStory_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calamityImpact" ADD CONSTRAINT "calamityImpact_barangayId_fkey" FOREIGN KEY ("barangayId") REFERENCES "Barangay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
