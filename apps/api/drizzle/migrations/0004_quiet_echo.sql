CREATE TABLE "carPicture" (
	"carPictureId" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"carId" integer NOT NULL,
	"index" integer NOT NULL,
	CONSTRAINT "carPicture_carId_index_unique" UNIQUE("carId","index")
);
--> statement-breakpoint
ALTER TABLE "carPicture" ADD CONSTRAINT "carPicture_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car" DROP COLUMN "picture";