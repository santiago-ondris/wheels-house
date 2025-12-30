CREATE TABLE "car" (
	"carId" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"brand" text NOT NULL,
	"manufacturer" text NOT NULL,
	"description" text,
	"designer" text,
	"series" text,
	"picture" text
);
--> statement-breakpoint
CREATE TABLE "carInCollection" (
	"carInCollectionId" serial PRIMARY KEY NOT NULL,
	"carId" integer NOT NULL,
	"collectionId" integer NOT NULL,
	CONSTRAINT "carInCollection_carId_collectionId_unique" UNIQUE("carId","collectionId")
);
--> statement-breakpoint
CREATE TABLE "collection" (
	"collectionId" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"userId" integer NOT NULL,
	"picture" text
);
--> statement-breakpoint
CREATE TABLE "group" (
	"groupId" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"collectionId" integer NOT NULL,
	"description" text,
	"picture" text
);
--> statement-breakpoint
CREATE TABLE "listedCar" (
	"groupedCarId" serial PRIMARY KEY NOT NULL,
	"carInCollectionId" integer NOT NULL,
	"groupId" integer NOT NULL,
	CONSTRAINT "listedCar_carInCollectionId_groupId_unique" UNIQUE("carInCollectionId","groupId")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"userId" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"hashedPassword" text NOT NULL,
	"createdDate" timestamp DEFAULT now(),
	"picture" text,
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "carInCollection" ADD CONSTRAINT "carInCollection_carId_car_carId_fk" FOREIGN KEY ("carId") REFERENCES "public"."car"("carId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carInCollection" ADD CONSTRAINT "carInCollection_collectionId_collection_collectionId_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collection"("collectionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection" ADD CONSTRAINT "collection_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_collectionId_collection_collectionId_fk" FOREIGN KEY ("collectionId") REFERENCES "public"."collection"("collectionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listedCar" ADD CONSTRAINT "listedCar_carInCollectionId_carInCollection_carInCollectionId_fk" FOREIGN KEY ("carInCollectionId") REFERENCES "public"."carInCollection"("carInCollectionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listedCar" ADD CONSTRAINT "listedCar_groupId_group_groupId_fk" FOREIGN KEY ("groupId") REFERENCES "public"."group"("groupId") ON DELETE no action ON UPDATE no action;