-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_content" TEXT,
    "utm_term" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Analytics_slug_locale_idx" ON "Analytics"("slug", "locale");
