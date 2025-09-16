-- Migration pour restructurer User et Profile
-- Étape 1: Ajouter les nouveaux champs à users
ALTER TABLE "users" ADD COLUMN "firstName" TEXT;
ALTER TABLE "users" ADD COLUMN "lastName" TEXT;
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" ADD COLUMN "isFounder" BOOLEAN DEFAULT false NOT NULL;

-- Étape 2: Migrer les données existantes de profiles.name vers users.firstName
-- En supposant que name contient le nom complet, on le met dans firstName
UPDATE "users"
SET "firstName" = "profiles"."name"
FROM "profiles"
WHERE "users"."id" = "profiles"."userId";

-- Étape 3: Migrer les données de profiles.phone vers users.phone (s'il existe)
UPDATE "users"
SET "phone" = "profiles"."phone"
FROM "profiles"
WHERE "users"."id" = "profiles"."userId" AND "profiles"."phone" IS NOT NULL;

-- Étape 4: Ajouter le nouveau rôle MEMBER
ALTER TYPE "Role" ADD VALUE 'MEMBER';

-- Étape 5: Modifier la table profiles
ALTER TABLE "profiles" DROP COLUMN "name";
ALTER TABLE "profiles" DROP COLUMN "phone";
ALTER TABLE "profiles" ADD COLUMN "displayName" TEXT;

-- Étape 6: Regenerer les contraintes et indexes si nécessaire
-- (Prisma s'en occupera automatiquement)