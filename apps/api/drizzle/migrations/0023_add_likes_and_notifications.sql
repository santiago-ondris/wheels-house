CREATE TABLE "carLike" (
	"userId" integer NOT NULL,
	"carId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groupLike" (
	"userId" integer NOT NULL,
	"groupId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"notificationId" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" text NOT NULL,
	"actorId" integer,
	"carId" integer,
	"groupId" integer,
	"metadata" jsonb,
	"read" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "carLike" ADD CONSTRAINT "carLike_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carLike" ADD CONSTRAINT "carLike_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupLike" ADD CONSTRAINT "groupLike_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupLike" ADD CONSTRAINT "groupLike_groupId_group_groupId_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("groupId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_actorId_user_userId_fk" FOREIGN KEY ("actorId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_groupId_group_groupId_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("groupId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "carLike_carId_idx" ON "carLike" USING btree ("carId");--> statement-breakpoint
CREATE INDEX "groupLike_groupId_idx" ON "groupLike" USING btree ("groupId");--> statement-breakpoint
CREATE INDEX "notification_userId_read_idx" ON "notification" USING btree ("userId","read");--> statement-breakpoint
CREATE INDEX "notification_createdAt_idx" ON "notification" USING btree ("createdAt");