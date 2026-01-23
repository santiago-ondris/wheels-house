CREATE TABLE "feedEvent" (
	"feedEventId" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"userId" integer NOT NULL,
	"carId" integer,
	"groupId" integer,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedEvent" ADD CONSTRAINT "feedEvent_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedEvent" ADD CONSTRAINT "feedEvent_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedEvent" ADD CONSTRAINT "feedEvent_groupId_group_groupId_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("groupId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedEvent_userId_idx" ON "feedEvent" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "feedEvent_createdAt_idx" ON "feedEvent" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "feedEvent_type_idx" ON "feedEvent" USING btree ("type");