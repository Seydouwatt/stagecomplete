-- Migration: Add name fields and migrate data

-- 1. Add name column to profiles (nullable first)
ALTER TABLE "profiles" ADD COLUMN "name" TEXT;

-- 2. Copy displayName to name where displayName exists
UPDATE "profiles" SET "name" = "displayName" WHERE "displayName" IS NOT NULL;

-- 3. Set default name for profiles without displayName
UPDATE "profiles" SET "name" = 'Utilisateur' WHERE "name" IS NULL;

-- 4. Make name column required
ALTER TABLE "profiles" ALTER COLUMN "name" SET NOT NULL;

-- 5. Remove displayName column
ALTER TABLE "profiles" DROP COLUMN "displayName";

-- 6. Add artistName column to artist_members (nullable first)
ALTER TABLE "artist_members" ADD COLUMN "artistName" TEXT;

-- 7. Add firstName and lastName columns to artist_members
ALTER TABLE "artist_members" ADD COLUMN "firstName" TEXT;
ALTER TABLE "artist_members" ADD COLUMN "lastName" TEXT;

-- 8. Copy existing name to artistName in artist_members
UPDATE "artist_members" SET "artistName" = "name" WHERE "name" IS NOT NULL;

-- 9. Set default artistName for members without name
UPDATE "artist_members" SET "artistName" = 'Membre' WHERE "artistName" IS NULL;

-- 10. Make artistName column required
ALTER TABLE "artist_members" ALTER COLUMN "artistName" SET NOT NULL;

-- 11. Remove the old name column from artist_members
ALTER TABLE "artist_members" DROP COLUMN "name";

-- 12. Remove artistName column from artists table (no longer needed)
ALTER TABLE "artists" DROP COLUMN "artistName";