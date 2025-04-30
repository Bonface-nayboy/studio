// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// **Enhanced Logging for Debugging**
console.log(`[mongodb.ts] Initial load: MONGODB_URI type is "${typeof MONGODB_URI}"`);
if (typeof MONGODB_URI === 'string') {
  // Log the value carefully, escaping potential special characters might be useful in some terminal environments
  console.log('[mongodb.ts] Initial load: MONGODB_URI value is:', JSON.stringify(MONGODB_URI));
  // Log the first few characters to check for invisible issues
  console.log(`[mongodb.ts] Initial load: MONGODB_URI starts with: "${MONGODB_URI.substring(0, 15)}..."`);
} else {
  console.log('[mongodb.ts] Initial load: MONGODB_URI is not a string or is undefined/null.');
}

// Add a check and log if the URI is missing or seems malformed immediately
if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
  console.error('[mongodb.ts] ERROR: MONGODB_URI environment variable is not defined, empty, or not a string.');
  console.error(`[mongodb.ts] Current MONGODB_URI value: ${MONGODB_URI}, type: ${typeof MONGODB_URI}`);
  // Throw error only if it's truly missing or not a string
  throw new Error('FATAL: MONGODB_URI environment variable is not set correctly in .env');
} else {
   console.log('[mongodb.ts] MONGODB_URI found in environment variables and is a string.');
   // Check the scheme explicitly here *after* confirming it's a non-empty string
   if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
     console.error('[mongodb.ts] ERROR: MONGODB_URI environment variable does not start with mongodb:// or mongodb+srv://');
     // Log the problematic URI *exactly* as it is before throwing
     console.error('[mongodb.ts] Current MONGODB_URI value being checked for scheme:', JSON.stringify(MONGODB_URI));
     throw new Error('Invalid MongoDB connection string scheme.'); // This is the line causing the error in the stack trace
   } else {
        console.log('[mongodb.ts] MONGODB_URI scheme check passed (starts with mongodb:// or mongodb+srv://).');
   }
}


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log('[dbConnect] Function called.');
  // Log the URI and its type *inside* dbConnect as well, in case it changes contextually
  console.log(`[dbConnect] MONGODB_URI inside dbConnect: type="${typeof MONGODB_URI}", value=${JSON.stringify(MONGODB_URI)}`);

  // Re-validate the URI *inside* dbConnect before proceeding
  if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
    console.error('[dbConnect] ERROR: MONGODB_URI is invalid or missing inside dbConnect.');
    throw new Error('MONGODB_URI is not available or invalid within dbConnect scope.');
  }
  // Re-check scheme just before using it
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
      console.error('[dbConnect] ERROR: Invalid scheme detected inside dbConnect right before connect attempt.');
      console.error('[dbConnect] Invalid URI value:', JSON.stringify(MONGODB_URI));
      cached.promise = null; // Clear promise if URI is invalid here
      throw new Error('Invalid MongoDB connection string scheme detected before connect.');
  }


  if (cached.conn) {
    console.log('[dbConnect] Using cached database connection.');
    // Optional: Check if connection is still valid? (Advanced)
    // try {
    //   await cached.conn.db.admin().ping();
    //   console.log('[dbConnect] Cached connection ping successful.');
    //   return cached.conn;
    // } catch (pingError) {
    //   console.warn('[dbConnect] Cached connection failed ping, attempting reconnect.', pingError);
    //   cached.conn = null;
    //   cached.promise = null; // Force re-creation of promise
    // }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Timeout faster for debugging
    };

    // **Crucial Logging Step:** Log the URI right before attempting connection
    console.log(`[dbConnect] Attempting to connect to MongoDB with URI: ${JSON.stringify(MONGODB_URI)}`);

    console.log('[dbConnect] Creating new database connection promise.');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('[dbConnect] Database connection established successfully.');
      return mongooseInstance;
    }).catch(err => {
       console.error('[dbConnect] Database connection error during initial connect:', err);
       // Log the full error object for more details
       console.error('[dbConnect] Full error object:', JSON.stringify(err, null, 2));
        // Log the URI that caused the error
       console.error(`[dbConnect] Connection failed for URI: ${JSON.stringify(MONGODB_URI)}`);
       cached.promise = null; // Reset promise on error
       // Throw a more specific error message if possible
       if (err.name === 'MongoParseError') {
           throw new Error(`Failed to parse MongoDB URI: ${err.message}`);
       } else if (err.message && err.message.includes('Invalid scheme')) {
            // This specific catch might be redundant now due to earlier checks, but good for defense
            throw new Error(`Invalid scheme error during connect for URI "${JSON.stringify(MONGODB_URI)}": ${err.message}`);
       }
       throw err; // Rethrow original error if it's not handled above
    });
  } else {
     console.log('[dbConnect] Reusing existing database connection promise.');
  }

  try {
      console.log('[dbConnect] Awaiting database connection promise...');
      cached.conn = await cached.promise;
      console.log('[dbConnect] Database connection promise resolved.');
  } catch (e: any) {
      console.error('[dbConnect] Error resolving database connection promise:', e.message);
       // Log the URI associated with this failed attempt
      console.error(`[dbConnect] Failed promise resolution for URI: ${JSON.stringify(MONGODB_URI)}`);
      cached.promise = null; // Ensure promise is cleared on error during await
      // Throw the specific error caught during connection attempt
      throw new Error(`Failed to connect to database: ${e.message || e}`);
  }

  // Final check after awaiting
  if (!cached.conn) {
     console.error('[dbConnect] Connection object is null after awaiting promise.');
     // This case might happen if the promise resolved but the connection object is somehow null
     // or if the catch block didn't properly rethrow.
     throw new Error('Database connection failed, connection object is null after resolution.');
  }

  console.log('[dbConnect] Returning connection object.');
  return cached.conn;
}

export default dbConnect;
