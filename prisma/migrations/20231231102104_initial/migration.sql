-- CreateEnum
CREATE TYPE "EventVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "Users" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "firstName" STRING NOT NULL,
    "lastName" STRING NOT NULL,
    "username" STRING,
    "image" STRING,
    "phone" STRING,
    "password" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsLetterSubscribers" (
    "id" STRING NOT NULL,
    "email" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "NewsLetterSubscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" STRING NOT NULL,
    "address" STRING NOT NULL,
    "city" STRING NOT NULL,
    "state" STRING NOT NULL,
    "country" STRING NOT NULL,
    "zipCode" STRING,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventImages" (
    "id" STRING NOT NULL,
    "imageUrl" STRING NOT NULL,
    "eventId" STRING NOT NULL,

    CONSTRAINT "EventImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tickets" (
    "id" STRING NOT NULL,
    "eventId" STRING NOT NULL,
    "role" STRING NOT NULL DEFAULT 'General',
    "price" DECIMAL(65,30) NOT NULL,
    "quantity" INT4 NOT NULL,
    "remainingTickets" INT4 NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" STRING NOT NULL,
    "eventId" STRING NOT NULL,
    "publisherId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "locationId" STRING,
    "venue" STRING,
    "date" TIMESTAMP(3) NOT NULL,
    "time" STRING NOT NULL,
    "category" STRING NOT NULL DEFAULT 'General',
    "visibility" "EventVisibility" NOT NULL DEFAULT 'PUBLIC',
    "mainImageUrl" STRING,
    "currency" STRING NOT NULL DEFAULT 'NGN',
    "purchaseStartDate" TIMESTAMP(3) NOT NULL,
    "purchaseEndDate" TIMESTAMP(3) NOT NULL,
    "allowedGuestType" STRING NOT NULL DEFAULT 'Everyone',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsForEvents" (
    "eventId" STRING NOT NULL,
    "tagId" STRING NOT NULL,

    CONSTRAINT "TagsForEvents_pkey" PRIMARY KEY ("eventId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetterSubscribers_email_key" ON "NewsLetterSubscribers"("email");

-- AddForeignKey
ALTER TABLE "EventImages" ADD CONSTRAINT "EventImages_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsForEvents" ADD CONSTRAINT "TagsForEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsForEvents" ADD CONSTRAINT "TagsForEvents_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
