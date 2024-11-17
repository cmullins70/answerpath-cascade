-- First add the column as nullable
ALTER TABLE "Document" ADD COLUMN "filePath" TEXT;

-- Update existing records with a placeholder path
UPDATE "Document" SET "filePath" = 'legacy/' || "fileName";

-- Make the column required
ALTER TABLE "Document" ALTER COLUMN "filePath" SET NOT NULL;
