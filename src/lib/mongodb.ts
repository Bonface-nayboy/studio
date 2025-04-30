// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// **Essential Initial Check - Log Raw Value and Type**
console.log(`[mongodb.ts] Initial load: MONGODB_URI type is "${typeof MONGODB_URI}", raw value=${JSON.stringify(MONGODB_URI)}`);

// 1. Check if the environment variable exists and is a non-empty string
if (!MONGODB_URI || typeof MONGODB_URI !== 'string' || MONGODB_URI.trim().length === 0) {
  console.error('[mongodb.ts] ERROR: MONGODB_URI environment variable is not defined, not a string, or is empty.');
  // Provide a more informative error message
  throw new Error('FATAL: MONGODB_URI environment variable is missing, invalid, or empty. Please check your .env file or environment configuration.');
} else {
    console.log('[mongodb.ts] MONGODB_URI basic check passed (exists, is string, not empty).');
}

// 2. Trim the URI *after* confirming it's a valid string
const trimmedUri = MONGODB_URI.trim();
console.log(`[mongodb.ts] Trimmed MONGODB_URI value: ${JSON.stringify(trimmedUri)}`);


// 3. Check the scheme on the *trimmed* URI
if (!trimmedUri.startsWith('mongodb://') && !trimmedUri.startsWith('mongodb+srv://')) {
    console.error('[mongodb.ts] ERROR: Trimmed MONGODB_URI does not start with mongodb:// or mongodb+srv://.');
    console.error('[mongodb.ts] Trimmed URI value:', JSON.stringify(trimmedUri));
    // Throw the specific error message that the user is seeing - this is the source of the persistent error
    throw new Error('Invalid MongoDB connection string scheme.'); // Line 25 (adjust line number based on actual final code)
} else {
    console.log('[mongodb.ts] MONGODB_URI scheme check passed (starts with mongodb:// or mongodb+srv://).');
}


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Use a type assertion for the global object to avoid 'any'
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  console.log('[dbConnect] Function called.');
  // Use the validated and trimmed URI from the module scope
  const uriToConnect = trimmedUri;

  if (cached.conn) {
    // Check mongoose connection state
    if (mongoose.connection.readyState >= 1) { // 1 = connected, 2 = connecting
        console.log('[dbConnect] Using cached and ready database connection.');
        return cached.conn;
    } else {
        console.warn('[dbConnect] Cached connection exists but is not ready (state: %s). Clearing cache and attempting reconnect.', mongoose.connection.readyState);
        // Clear potentially broken cache
        cached.conn = null;
        cached.promise = null;
        mongoose.connection.close().catch(err => console.error('[dbConnect] Error closing stale connection:', err)); // Attempt to close old connection
    }
  }


  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Important for catching connection errors quickly
      serverSelectionTimeoutMS: 5000, // Timeout faster for debugging
      // useNewUrlParser and useUnifiedTopology are deprecated and default to true in Mongoose 6+
      appName: 'ProductShowcaseApp', // Optional: Identify the app in MongoDB logs
       // Add socket timeout
      socketTimeoutMS: 45000, // Example: 45 seconds
    };

    console.log(`[dbConnect] Attempting to connect to MongoDB with trimmed URI: ${JSON.stringify(uriToConnect)}`);

    // Final check before connect, though the module-level check should prevent this
    if (!uriToConnect || !uriToConnect.startsWith('mongodb') ) {
        console.error('[dbConnect] CRITICAL ERROR: uriToConnect is invalid immediately before mongoose.connect call.', JSON.stringify(uriToConnect));
        cached.promise = null; // Ensure promise is nullified
        throw new Error('Invalid MongoDB URI immediately before connection attempt.');
    }

    console.log('[dbConnect] Creating new database connection promise.');
    // Store the promise
    cached.promise = mongoose.connect(uriToConnect, opts).then((mongooseInstance) => {
      console.log('[dbConnect] Database connection established successfully.');
      cached.conn = mongooseInstance; // Cache the connection object itself on success
      return mongooseInstance;
    }).catch(err => {
       console.error('[dbConnect] Database connection error during initial connect:', err);
       // Log specific error properties if available
       if (err.name) console.error(`[dbConnect] Error Name: ${err.name}`);
       if (err.message) console.error(`[dbConnect] Error Message: ${err.message}`);
       console.error(`[dbConnect] Connection failed for URI: ${JSON.stringify(uriToConnect)}`);
       cached.promise = null; // Reset promise on error
       cached.conn = null;    // Reset connection on error
       // Rethrow the original error or a more specific one
       throw new Error(`Failed to connect to MongoDB: ${err.message || 'Unknown connection error'}`);
    });
  } else {
     console.log('[dbConnect] Reusing existing database connection promise.');
  }

  // Await the promise (either the one just created or the existing one)
  try {
      console.log('[dbConnect] Awaiting database connection promise...');
      // Assign the resolved connection to cached.conn if it's not already set
      if (!cached.conn) {
          cached.conn = await cached.promise;
      }
      console.log('[dbConnect] Database connection promise resolved.');
  } catch (e: any) {
      console.error('[dbConnect] Error resolving database connection promise:', e.message || e);
      console.error(`[dbConnect] Failed promise resolution for URI: ${JSON.stringify(uriToConnect)}`);
      cached.promise = null; // Ensure promise is cleared on error during await
      cached.conn = null; // Ensure connection is cleared
      throw e; // Rethrow the error caught during the connection attempt or promise resolution
  }

  // Final check after awaiting
  if (!cached.conn) {
     console.error('[dbConnect] Connection object is null after awaiting promise.');
     cached.promise = null; // Ensure promise is cleared
     throw new Error('Database connection failed: Connection object is unexpectedly null after promise resolution.');
  }

  if (mongoose.connection.readyState < 1) {
        console.error('[dbConnect] Connection object exists, but readyState indicates disconnection (%s).', mongoose.connection.readyState);
        cached.conn = null;
        cached.promise = null;
         throw new Error('Database connection failed: Connection state is disconnected after resolving.');
  }


  console.log('[dbConnect] Returning valid connection object.');
  return cached.conn;
}

export default dbConnect;
