ALTER TABLE "user" ALTER COLUMN "createdDate" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdDate" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "restorePasswordHashedToken" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "restorePasswordTokenExpires" timestamp with time zone;