-- CreateTable
CREATE TABLE "RoomHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoomHistory" ADD CONSTRAINT "RoomHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
