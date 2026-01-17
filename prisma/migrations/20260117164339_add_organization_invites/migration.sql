-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');

-- AlterEnum
ALTER TYPE "user_role" ADD VALUE 'ORG_ADMIN';

-- CreateTable
CREATE TABLE "organization_invites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "org_id" UUID NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "role" "user_role" NOT NULL,
    "token_hash" VARCHAR(250) NOT NULL,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "status" NOT NULL DEFAULT 'PENDING',
    "created_by" UUID NOT NULL,
    "accepted_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_invites_token_hash_key" ON "organization_invites"("token_hash");
