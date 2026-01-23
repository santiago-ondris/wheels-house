/**
 * Database Schema - Barrel Export
 * 
 * This file re-exports all schema definitions for easy importing.
 * The schemas are organized by domain for maintainability.
 */

// User domain
export { user, searchHistory } from './user.schema';

// Car domain
export { car, carPicture } from './car.schema';

// Group domain
export { group, groupedCar } from './group.schema';

// WheelWord game domain
export { gameWord, dailyGame, userGameAttempt } from './wheelword.schema';

// Social domain (future - will be added when implementing social features)
// export { feedEvent, userPost, userFollow, carLike, notification } from './social.schema';
