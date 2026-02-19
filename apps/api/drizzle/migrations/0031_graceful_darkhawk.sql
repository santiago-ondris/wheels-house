CREATE TABLE "carSearchHistory" (
	"userId" integer NOT NULL,
	"carId" integer NOT NULL,
	"searchedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "carSearchHistory" ADD CONSTRAINT "carSearchHistory_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carSearchHistory" ADD CONSTRAINT "carSearchHistory_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "carSearchHistory_userId_idx" ON "carSearchHistory" USING btree ("userId");