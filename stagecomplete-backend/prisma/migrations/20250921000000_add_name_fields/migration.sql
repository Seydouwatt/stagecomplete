-- Migration: Add name fields and migrate data (idempotent version)

-- 1. Add name column to profiles (nullable first) - idempotent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'name') THEN
    ALTER TABLE "profiles" ADD COLUMN "name" TEXT;
  END IF;
END $$;

-- 2. Copy displayName to name where displayName exists (only if displayName column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'profiles' AND column_name = 'displayName') THEN
    UPDATE "profiles" SET "name" = "displayName" WHERE "displayName" IS NOT NULL AND "name" IS NULL;
  END IF;
END $$;

-- 3. Set default name for profiles without name
UPDATE "profiles" SET "name" = 'Utilisateur' WHERE "name" IS NULL;

-- 4. Make name column required (only if exists and nullable)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'profiles' AND column_name = 'name' AND is_nullable = 'YES') THEN
    ALTER TABLE "profiles" ALTER COLUMN "name" SET NOT NULL;
  END IF;
END $$;

-- 5. Remove displayName column (idempotent)
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "displayName";

-- 6. Add artistName column to artist_members (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'artist_members' AND column_name = 'artistName') THEN
    ALTER TABLE "artist_members" ADD COLUMN "artistName" TEXT;
  END IF;
END $$;

-- 7. Add firstName and lastName columns to artist_members (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'artist_members' AND column_name = 'firstName') THEN
    ALTER TABLE "artist_members" ADD COLUMN "firstName" TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'artist_members' AND column_name = 'lastName') THEN
    ALTER TABLE "artist_members" ADD COLUMN "lastName" TEXT;
  END IF;
END $$;

-- 8. Copy existing name to artistName in artist_members (only if name column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'artist_members' AND column_name = 'name') THEN
    UPDATE "artist_members" SET "artistName" = "name" WHERE "name" IS NOT NULL AND "artistName" IS NULL;
  END IF;
END $$;

-- 9. Set default artistName for members without artistName
UPDATE "artist_members" SET "artistName" = 'Membre' WHERE "artistName" IS NULL;

-- 10. Make artistName column required (only if exists and nullable)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_name = 'artist_members' AND column_name = 'artistName' AND is_nullable = 'YES') THEN
    ALTER TABLE "artist_members" ALTER COLUMN "artistName" SET NOT NULL;
  END IF;
END $$;

-- 11. Remove the old name column from artist_members (idempotent)
ALTER TABLE "artist_members" DROP COLUMN IF EXISTS "name";

-- 12. Remove artistName column from artists table (idempotent)
ALTER TABLE "artists" DROP COLUMN IF EXISTS "artistName";