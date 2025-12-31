ALTER TABLE "collection" ADD CONSTRAINT "collection_name_userId_unique" UNIQUE("name","userId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");