CREATE TABLE "dailyGame" (
	"dailyGameId" serial PRIMARY KEY NOT NULL,
	"gameNumber" integer NOT NULL,
	"gameWordId" integer NOT NULL,
	"gameDate" date NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "dailyGame_gameNumber_unique" UNIQUE("gameNumber"),
	CONSTRAINT "dailyGame_gameDate_unique" UNIQUE("gameDate")
);
--> statement-breakpoint
CREATE TABLE "gameWord" (
	"gameWordId" serial PRIMARY KEY NOT NULL,
	"word" text NOT NULL,
	"category" text NOT NULL,
	"timesUsed" integer DEFAULT 0,
	"lastUsedAt" timestamp with time zone,
	CONSTRAINT "gameWord_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "userGameAttempt" (
	"userGameAttemptId" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"dailyGameId" integer NOT NULL,
	"attempts" text[],
	"attemptsCount" integer NOT NULL,
	"won" boolean NOT NULL,
	"completedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "userGameAttempt_userId_dailyGameId_unique" UNIQUE("userId","dailyGameId")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordGamesPlayed" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordGamesWon" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordCurrentStreak" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordMaxStreak" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordLastPlayedDate" date;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "wheelwordWinDistribution" text DEFAULT '0,0,0,0,0,0';--> statement-breakpoint
ALTER TABLE "dailyGame" ADD CONSTRAINT "dailyGame_gameWordId_gameWord_gameWordId_fk" FOREIGN KEY ("gameWordId") REFERENCES "public"."gameWord"("gameWordId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userGameAttempt" ADD CONSTRAINT "userGameAttempt_userId_user_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("userId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userGameAttempt" ADD CONSTRAINT "userGameAttempt_dailyGameId_dailyGame_dailyGameId_fk" FOREIGN KEY ("dailyGameId") REFERENCES "public"."dailyGame"("dailyGameId") ON DELETE no action ON UPDATE no action;