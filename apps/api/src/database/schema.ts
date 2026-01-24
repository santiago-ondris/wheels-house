/**
 * Database Schema - Barrel Export (Backward Compatibility Layer)
 * 
 * This file re-exports all schema definitions from the modular schema files.
 * Existing imports from './schema' continue to work without changes.
 * 
 * Schema organization:
 * - schema/user.schema.ts     → User, SearchHistory
 * - schema/car.schema.ts      → Car, CarPicture
 * - schema/group.schema.ts    → Group, GroupedCar
 * - schema/wheelword.schema.ts → GameWord, DailyGame, UserGameAttempt
 * - schema/social.schema.ts   → (Future) FeedEvent, UserPost, UserFollow, etc.
 */

// Re-export everything from modular schema files
export * from './schema/index';