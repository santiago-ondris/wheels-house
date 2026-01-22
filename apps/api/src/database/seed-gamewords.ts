/**
 * Seed script para poblar la tabla gameWord con las palabras automotrices.
 * 
 * Ejecutar con: npx ts-node src/database/seed-gamewords.ts
 */

import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { gameWord } from "./schema";
import { GAME_WORDS } from "../data/gameWords";

async function seed() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('🌱 Seeding gameWord table...');
    console.log(`📝 ${GAME_WORDS.length} palabras a insertar`);

    let inserted = 0;
    let skipped = 0;

    for (const wordData of GAME_WORDS) {
        try {
            await db.insert(gameWord).values({
                word: wordData.word.toUpperCase(),
                category: wordData.category,
                timesUsed: 0,
            });
            inserted++;
        } catch (error: any) {
            // Palabra ya existe (unique constraint)
            if (error.code === '23505') {
                skipped++;
            } else {
                console.error(`Error insertando ${wordData.word}:`, error.message);
            }
        }
    }

    console.log(`✅ ${inserted} palabras insertadas`);
    console.log(`⏭️ ${skipped} palabras ya existían`);

    await pool.end();
    console.log('🏁 Seed completado!');
}

seed().catch(console.error);
