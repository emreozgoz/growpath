-- CreateIndex
CREATE INDEX "learning_paths_userId_status_idx" ON "learning_paths"("userId", "status");

-- CreateIndex
CREATE INDEX "learning_paths_userId_createdAt_idx" ON "learning_paths"("userId", "createdAt" DESC);
