CREATE TABLE "searchHistory" (
	"searchHistoryId" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"searchedUserId" integer NOT NULL,
	"searchedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "searchHistory_userId_searchedUserId_unique" UNIQUE("userId","searchedUserId")
);
--> statement-breakpoint
ALTER TABLE "searchHistory" ADD CONSTRAINT "searchHistory_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "searchHistory" ADD CONSTRAINT "searchHistory_searchedUserId_user_userId_fk" FOREIGN KEY ("searchedUserId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;