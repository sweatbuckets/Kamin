-- Create missing users from existing order wallet addresses
INSERT INTO "User" ("walletAddress")
SELECT DISTINCT LOWER("userAddress")
FROM "Order"
WHERE "userAddress" IS NOT NULL
ON CONFLICT ("walletAddress") DO NOTHING;

-- Add nullable foreign key column first
ALTER TABLE "Order" ADD COLUMN "userId" INTEGER;

-- Backfill userId from existing wallet address values
UPDATE "Order" o
SET "userId" = u."id"
FROM "User" u
WHERE LOWER(o."userAddress") = u."walletAddress";

-- Make the relation required after backfill
ALTER TABLE "Order" ALTER COLUMN "userId" SET NOT NULL;

-- Drop denormalized address column
ALTER TABLE "Order" DROP COLUMN "userAddress";

-- Add foreign key
ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add index for relation lookups
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
