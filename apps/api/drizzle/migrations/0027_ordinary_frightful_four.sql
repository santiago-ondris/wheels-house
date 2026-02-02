CREATE TYPE "public"."contact_reason" AS ENUM('BUG', 'SUGGESTION', 'GENERAL');--> statement-breakpoint
CREATE TABLE "contact_message" (
	"contactMessageId" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"reason" "contact_reason" DEFAULT 'GENERAL' NOT NULL,
	"message" text NOT NULL,
	"userId" integer,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"adminNotes" text
);
--> statement-breakpoint
ALTER TABLE "contact_message" ADD CONSTRAINT "contact_message_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;