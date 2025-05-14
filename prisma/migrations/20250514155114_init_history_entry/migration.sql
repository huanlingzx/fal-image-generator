-- CreateTable
CREATE TABLE "HistoryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "modelId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT NOT NULL,
    "imageContentType" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageSize" TEXT,
    "numInferenceSteps" INTEGER,
    "seed" BIGINT,
    "guidanceScale" DOUBLE PRECISION,
    "numImages" INTEGER,
    "outputFormat" TEXT,
    "enableSafetyChecker" BOOLEAN,
    "lorasJson" TEXT,
    "otherParamsJson" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoryEntry_userId_idx" ON "HistoryEntry"("userId");

-- CreateIndex
CREATE INDEX "HistoryEntry_timestamp_idx" ON "HistoryEntry"("timestamp");

-- CreateIndex
CREATE INDEX "HistoryEntry_isFavorite_idx" ON "HistoryEntry"("isFavorite");

-- CreateIndex
CREATE INDEX "HistoryEntry_isDeleted_idx" ON "HistoryEntry"("isDeleted");
