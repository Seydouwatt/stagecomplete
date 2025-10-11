-- Create SubscriptionType enum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- Drop the default value first
ALTER TABLE "users" ALTER COLUMN "plan" DROP DEFAULT;

-- Convert existing plan column from TEXT to SubscriptionType enum
ALTER TABLE "users" ALTER COLUMN "plan" TYPE "SubscriptionType" USING ("plan"::"SubscriptionType");

-- Add back the default value with correct enum type
ALTER TABLE "users" ALTER COLUMN "plan" SET DEFAULT 'FREE'::"SubscriptionType";
