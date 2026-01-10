ALTER TABLE "user" ADD COLUMN "restorePasswordRequestSelector" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "restorePasswordHashedValidator" text;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "restorePasswordHashedToken";