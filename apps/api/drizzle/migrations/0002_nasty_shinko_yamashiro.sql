CREATE TABLE "groupedCar" (
	"groupedCarId" serial PRIMARY KEY NOT NULL,
	"carId" integer NOT NULL,
	"groupId" integer NOT NULL,
	CONSTRAINT "groupedCar_carId_groupId_unique" UNIQUE("carId","groupId")
);
--> statement-breakpoint
DROP TABLE "listedCar" CASCADE;--> statement-breakpoint
ALTER TABLE "groupedCar" ADD CONSTRAINT "groupedCar_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groupedCar" ADD CONSTRAINT "groupedCar_groupId_group_groupId_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("groupId") ON DELETE no action ON UPDATE no action;