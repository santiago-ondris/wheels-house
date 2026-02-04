CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"updatedBy" integer
);
--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_updatedBy_user_userId_fk" FOREIGN KEY ("updatedBy") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;