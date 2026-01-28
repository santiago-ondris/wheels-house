CREATE TABLE "userFollow" (
	"followerId" integer NOT NULL,
	"followedId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "userFollow" ADD CONSTRAINT "userFollow_followerId_user_userId_fk" FOREIGN KEY ("followerId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userFollow" ADD CONSTRAINT "userFollow_followedId_user_userId_fk" FOREIGN KEY ("followedId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userFollow_followerId_idx" ON "userFollow" USING btree ("followerId");--> statement-breakpoint
CREATE INDEX "userFollow_followedId_idx" ON "userFollow" USING btree ("followedId");