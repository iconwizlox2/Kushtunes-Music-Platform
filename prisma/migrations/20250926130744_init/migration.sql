-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "emailVerified" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "artists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "payoutMethod" TEXT,
    "taxStatus" TEXT NOT NULL DEFAULT 'INDIVIDUAL',
    "taxId" TEXT,
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "kycDocuments" JSONB,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "artists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "releases" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "upc" TEXT,
    "title" TEXT NOT NULL,
    "version" TEXT,
    "label" TEXT,
    "primaryArtistId" TEXT NOT NULL,
    "releaseDate" DATETIME NOT NULL,
    "territories" JSONB NOT NULL,
    "excludedTerritories" JSONB,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "genre" TEXT,
    "subgenre" TEXT,
    "copyrightYear" INTEGER,
    "pLine" TEXT,
    "cLine" TEXT,
    "coverUrl" TEXT,
    "galleryUrls" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "releases_primaryArtistId_fkey" FOREIGN KEY ("primaryArtistId") REFERENCES "artists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "releaseId" TEXT NOT NULL,
    "isrc" TEXT,
    "title" TEXT NOT NULL,
    "version" TEXT,
    "trackNumber" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "duration" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "previewStart" INTEGER,
    "lyrics" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tracks_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contributors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "ipi" TEXT,
    "cae" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "contributors_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "splits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "percent" REAL NOT NULL,
    "recoupmentFlag" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "splits_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "splits_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "releaseId" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" DATETIME,
    "message" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "deliveries_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "importedFlag" BOOLEAN NOT NULL DEFAULT false,
    "importedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "earnings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trackId" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL,
    "reportId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "earnings_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "earnings_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artistId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "invoiceUrl" TEXT,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payouts_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rights" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "releaseId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mechanicalLicense" TEXT,
    "publicDomainFlag" BOOLEAN NOT NULL DEFAULT false,
    "copyrightOwner" TEXT,
    "copyrightYear" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "rights_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "releases" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "compliance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "releaseId" TEXT,
    "trackId" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "action" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artistId" TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "advances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artistId" TEXT NOT NULL,
    "amountUSD" REAL NOT NULL,
    "remainingUSD" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "advances_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "costs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "artistId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "recoupable" BOOLEAN NOT NULL DEFAULT true,
    "amountUSD" REAL NOT NULL,
    "remainingUSD" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "costs_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "labels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "labels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "label_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "labelId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'artist',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "label_members_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "label_members_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "artists_userId_key" ON "artists"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "artists_email_key" ON "artists"("email");

-- CreateIndex
CREATE UNIQUE INDEX "releases_upc_key" ON "releases"("upc");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_isrc_key" ON "tracks"("isrc");

-- CreateIndex
CREATE UNIQUE INDEX "label_members_labelId_artistId_key" ON "label_members"("labelId", "artistId");
