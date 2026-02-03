ALTER TABLE "contact_message" ADD COLUMN "archived" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contact_message" ADD COLUMN "archivedAt" timestamp with time zone;