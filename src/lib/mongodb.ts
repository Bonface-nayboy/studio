// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Add a check and log if the URI is missing or seems malformed immediately
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI environment variable is not defined.');
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
} else {
   console.log('MONGODB_URI found in environment variables.'); // Log that it's found
   // Check the scheme explicitly here as well
   if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
     console.error('ERROR: MONGODB_URI environment variable does not start with mongodb:// or mongodb+srv://');
     console.error(`Current MONGODB_URI value being checked: "${MONGODB_URI}"`); // Log the problematic URI
     throw new Error('Invalid MongoDB connection string scheme.');
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
  if (cached.conn) {
    console.log('Using cached database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Consider adding serverSelectionTimeoutMS if needed:
      // serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    // **Crucial Logging Step:** Log the URI right before attempting connection
    console.log(`Attempting to connect to MongoDB with URI: "${MONGODB_URI}"`); // Log the exact string being used

    // Re-check the scheme right before connecting, just in case
    if (!MONGODB_URI || (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://'))) {
        console.error('ERROR: MONGODB_URI is invalid right before mongoose.connect call.');
        console.error(`Invalid URI value: "${MONGODB_URI}"`);
        throw new Error('Invalid MongoDB connection string scheme detected before connect.');
    }


    console.log('Creating new database connection promise');
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      console.log('Database connection established successfully');
      return mongooseInstance;
    }).catch(err => {
       console.error('Database connection error during initial connect:', err);
       // Log the full error object for more details
       console.error('Full error object:', JSON.stringify(err, null, 2));
        // Log the URI that caused the error
       console.error(`Connection failed for URI: "${MONGODB_URI}"`);
       cached.promise = null; // Reset promise on error
       // Throw a more specific error message if possible
       if (err.name === 'MongoParseError') {
           throw new Error(`Failed to parse MongoDB URI: ${err.message}`);
       } else if (err.message && err.message.includes('Invalid scheme')) {
            throw new Error(`Invalid scheme error during connect for URI "${MONGODB_URI}": ${err.message}`);
       }
       throw err; // Rethrow original error if it's not a parse error
    });
  } else {
     console.log('Reusing existing database connection promise');
  }

  try {
      console.log('Awaiting database connection promise...');
      cached.conn = await cached.promise;
      console.log('Database connection promise resolved.');
  } catch (e: any) {
      console.error('Error resolving database connection promise:', e);
       // Log the URI associated with this failed attempt
      console.error(`Failed promise resolution for URI: "${MONGODB_URI}"`);
      cached.promise = null; // Ensure promise is cleared on error during await
      // Throw the specific error caught during connection attempt
      throw new Error(`Failed to connect to database: ${e.message || e}`);
  }
  return cached.conn;
}

export default dbConnect;
