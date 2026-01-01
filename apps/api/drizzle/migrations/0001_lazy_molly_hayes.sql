ALTER TABLE "carInCollection" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "collection" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "carInCollection" CASCADE;--> statement-breakpoint
DROP TABLE "collection" CASCADE;--> statement-breakpoint
--> statement-breakpoint
--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN "scale" text NOT NULL;--> statement-breakpoint
ALTER TABLE "car" ADD COLUMN "userId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ADD COLUMN "userId" integer NOT NULL;--> statement-breakpoint
-- ALTER TABLE "listedCar" ADD COLUMN "carId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "car" ADD CONSTRAINT "car_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "listedCar" ADD CONSTRAINT "listedCar_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" DROP COLUMN "collectionId";--> statement-breakpoint
-- ALTER TABLE "listedCar" DROP COLUMN "carInCollectionId";--> statement-breakpoint
-- ALTER TABLE "listedCar" ADD CONSTRAINT "listedCar_carId_groupId_unique" UNIQUE("carId","groupId");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");