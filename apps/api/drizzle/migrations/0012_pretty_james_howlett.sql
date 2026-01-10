ALTER TABLE "user" RENAME COLUMN "restorePasswordRequestSelector" TO "resetPasswordRequestSelector";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "restorePasswordHashedValidator" TO "resetPasswordHashedValidator";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "restorePasswordTokenExpires" TO "resetPasswordTokenExpires";