import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// a revisar.
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "antonio1234",
  database: "wheels_db",
});

export const db = drizzle(pool, {
  schema,
  logger: true,
});