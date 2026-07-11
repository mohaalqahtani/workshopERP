-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'RECEPTIONIST', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "Job_Cards_Status" AS ENUM ('Registered', 'In_Inspection', 'In_Progress', 'Ready', 'Paid', 'Closed');

-- CreateEnum
CREATE TYPE "CustomerRank" AS ENUM ('Bronze', 'Silver', 'Gold');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'TECHNICIAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rank" "CustomerRank" NOT NULL DEFAULT 'Bronze',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicles" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year_created" INTEGER NOT NULL,
    "plate_number" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "Vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parts_Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stock_qty" INTEGER NOT NULL,
    "base_price" DECIMAL(65,30) NOT NULL,
    "compatible_cars" TEXT[],
    "image_url" TEXT NOT NULL,

    CONSTRAINT "Parts_Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services_List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "required_mechanics" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Services_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "System_Logs" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "System_Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_Cards" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Job_Cards_Status" NOT NULL DEFAULT 'Registered',
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "technician_id" TEXT NOT NULL,
    "vehicle_id" INTEGER NOT NULL,

    CONSTRAINT "Job_Cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_Card_Parts" (
    "id" SERIAL NOT NULL,
    "job_card_id" INTEGER NOT NULL,
    "part_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sold_price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Job_Card_Parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job_Card_Services" (
    "id" SERIAL NOT NULL,
    "job_card_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "Job_Card_Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection_Photos" (
    "id" SERIAL NOT NULL,
    "job_card_id" INTEGER NOT NULL,
    "photo_Url" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inspection_Photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_phone_key" ON "Customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicles_plate_number_key" ON "Vehicles"("plate_number");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicles" ADD CONSTRAINT "Vehicles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "System_Logs" ADD CONSTRAINT "System_Logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Cards" ADD CONSTRAINT "Job_Cards_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Cards" ADD CONSTRAINT "Job_Cards_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Card_Parts" ADD CONSTRAINT "Job_Card_Parts_job_card_id_fkey" FOREIGN KEY ("job_card_id") REFERENCES "Job_Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Card_Parts" ADD CONSTRAINT "Job_Card_Parts_part_id_fkey" FOREIGN KEY ("part_id") REFERENCES "Parts_Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Card_Services" ADD CONSTRAINT "Job_Card_Services_job_card_id_fkey" FOREIGN KEY ("job_card_id") REFERENCES "Job_Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job_Card_Services" ADD CONSTRAINT "Job_Card_Services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Services_List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection_Photos" ADD CONSTRAINT "Inspection_Photos_job_card_id_fkey" FOREIGN KEY ("job_card_id") REFERENCES "Job_Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspection_Photos" ADD CONSTRAINT "Inspection_Photos_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
