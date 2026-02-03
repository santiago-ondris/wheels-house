ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "hiddenReason" text;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "hiddenAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN IF NOT EXISTS "hiddenBy" integer;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN IF NOT EXISTS "hidden" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN IF NOT EXISTS "hiddenReason" text;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN IF NOT EXISTS "hiddenAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN IF NOT EXISTS "hiddenBy" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_hiddenBy_user_userId_fk" FOREIGN KEY ("hiddenBy") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_hiddenBy_user_userId_fk" FOREIGN KEY ("hiddenBy") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;