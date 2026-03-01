-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'STARTER', 'PRO', 'UNLIMITED');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "PathStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'ABANDONED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "avatarUrl" TEXT,
    "tier" "UserTier" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_paths" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "currentLevel" "SkillLevel" NOT NULL,
    "targetLevel" "SkillLevel",
    "durationWeeks" INTEGER NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "goals" TEXT[],
    "aiModel" TEXT NOT NULL,
    "planData" JSONB NOT NULL,
    "status" "PathStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_progress" (
    "id" TEXT NOT NULL,
    "learningPathId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "taskId" TEXT NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_usage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningPathId" TEXT,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "costUsd" DECIMAL(10,6) NOT NULL,
    "cacheHit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "tier" "UserTier" NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_tier_idx" ON "users"("tier");

-- CreateIndex
CREATE INDEX "learning_paths_userId_idx" ON "learning_paths"("userId");

-- CreateIndex
CREATE INDEX "learning_paths_status_idx" ON "learning_paths"("status");

-- CreateIndex
CREATE INDEX "learning_paths_createdAt_idx" ON "learning_paths"("createdAt");

-- CreateIndex
CREATE INDEX "learning_progress_learningPathId_idx" ON "learning_progress"("learningPathId");

-- CreateIndex
CREATE INDEX "learning_progress_completed_idx" ON "learning_progress"("completed");

-- CreateIndex
CREATE UNIQUE INDEX "learning_progress_learningPathId_week_day_taskId_key" ON "learning_progress"("learningPathId", "week", "day", "taskId");

-- CreateIndex
CREATE INDEX "ai_usage_userId_idx" ON "ai_usage"("userId");

-- CreateIndex
CREATE INDEX "ai_usage_createdAt_idx" ON "ai_usage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- AddForeignKey
ALTER TABLE "learning_paths" ADD CONSTRAINT "learning_paths_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_progress" ADD CONSTRAINT "learning_progress_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_usage" ADD CONSTRAINT "ai_usage_learningPathId_fkey" FOREIGN KEY ("learningPathId") REFERENCES "learning_paths"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
