// src/lib/mongodb.ts
import mongoose from 'mongoose';

// Remove MONGODB_URI reading and validation from module scope

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Initialize cache in global scope
let cached: MongooseCache = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  console.log('[dbConnect] Function called.');

  // --- Start: Read and Validate MONGODB_URI inside the function ---
  const MONGODB_URI = process.env.MONGODB_URI;
  console.log(`[dbConnect] Reading MONGODB_URI inside function: type="${typeof MONGODB_URI}", value=${JSON.stringify(MONGODB_URI)}`);

  // 1. Check if the environment variable exists and is a non-empty string
  if (!MONGODB_URI || typeof MONGODB_URI !== 'string' || MONGODB_URI.trim().length === 0) {
    console.error('[dbConnect] ERROR: MONGODB_URI environment variable is not defined, not a string, or is empty inside dbConnect.');
    throw new Error('FATAL: MONGODB_URI environment variable is missing, invalid, or empty when dbConnect was called.');
  } else {
    console.log('[dbConnect] MONGODB_URI basic check passed inside function.');
  }

  // 2. Trim the URI *after* confirming it's a valid string
  const trimmedUri = MONGODB_URI.trim();
  console.log(`[dbConnect] Trimmed MONGODB_URI value inside function: ${JSON.stringify(trimmedUri)}`);

  // 3. Check the scheme on the *trimmed* URI
  if (!trimmedUri.startsWith('mongodb://') && !trimmedUri.startsWith('mongodb+srv://')) {
    console.error('[dbConnect] ERROR: Trimmed MONGODB_URI does not start with mongodb:// or mongodb+srv:// inside dbConnect.');
    console.error('[dbConnect] Trimmed URI value:', JSON.stringify(trimmedUri));
    // Throw the specific error message that the user is seeing
    throw new Error('Invalid MongoDB connection string scheme.'); // Match the error source
  } else {
    console.log('[dbConnect] MONGODB_URI scheme check passed inside function.');
  }
  // --- End: Read and Validate MONGODB_URI inside the function ---

  // Use the validated and trimmed URI obtained *inside* this function call
  const uriToConnect = trimmedUri;

  // Check cached connection status
  if (cached.conn) {
    if (mongoose.connection.readyState >= 1) { // 1 = connected, 2 = connecting
      console.log('[dbConnect] Using cached and ready database connection (state: %s).', mongoose.connection.readyState);
      return cached.conn;
    } else {
      console.warn('[dbConnect] Cached connection exists but is not ready (state: %s). Clearing cache and attempting reconnect.', mongoose.connection.readyState);
      cached.conn = null;
      cached.promise = null;
      mongoose.connection.close().catch(err => console.error('[dbConnect] Error closing stale connection:', err));
    }
  }

  // Establish new connection if no valid cached promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      appName: 'ProductShowcaseApp',
      socketTimeoutMS: 45000,
    };

    console.log(`[dbConnect] Attempting to connect to MongoDB with validated/trimmed URI from function scope: ${JSON.stringify(uriToConnect)}`);
    console.log('[dbConnect] Creating new database connection promise.');

    cached.promise = mongoose.connect(uriToConnect, opts).then((mongooseInstance) => {
      console.log('[dbConnect] Database connection established successfully (readyState: %s).', mongooseInstance.connection.readyState);
      return mongooseInstance; // Return the instance for the await below
    }).catch(err => {
      console.error('[dbConnect] Database connection error during initial connect:', err);
      if (err.name) console.error(`[dbConnect] Error Name: ${err.name}`);
      if (err.message) console.error(`[dbConnect] Error Message: ${err.message}`);
      console.error(`[dbConnect] Connection failed for URI: ${JSON.stringify(uriToConnect)}`);
      cached.promise = null; // Reset promise on error
      cached.conn = null; // Also reset connection
      throw new Error(`Failed to connect to MongoDB: ${err.message || 'Unknown connection error'}`);
    });
  } else {
    console.log('[dbConnect] Reusing existing database connection promise.');
  }

  // Await the promise and cache the connection object
  try {
    console.log('[dbConnect] Awaiting database connection promise...');
    const connection = await cached.promise;
    cached.conn = connection; // Cache the connection object ONLY after successful await
    console.log('[dbConnect] Database connection promise resolved (readyState: %s).', connection.connection.readyState);
  } catch (e: any) {
    console.error('[dbConnect] Error resolving database connection promise:', e.message || e);
    cached.promise = null; // Clear promise on error
    cached.conn = null; // Clear connection on error
    throw e; // Rethrow the caught error
  }

  // Final check before returning
  if (!cached.conn) {
    console.error('[dbConnect] FATAL: Connection object is null after awaiting promise.');
    throw new Error('Database connection failed: Connection object is unexpectedly null after promise resolution.');
  }

  if (mongoose.connection.readyState < 1) {
    console.error('[dbConnect] FATAL: Connection object exists, but readyState indicates disconnection (%s) AFTER promise resolution.', mongoose.connection.readyState);
    cached.conn = null;
    cached.promise = null;
    mongoose.connection.close().catch(err => console.error('[dbConnect] Error closing connection after failed readyState check:', err));
    throw new Error('Database connection failed: Connection state is disconnected after resolving.');
  }

  console.log('[dbConnect] Returning valid connection object (readyState: %s).', cached.conn.connection.readyState);
  return cached.conn;
}

export default dbConnect;
