import mongoose, { type Mongoose } from 'mongoose';

/**
 * MongoDB connection string.
 *
 * Must be defined in your environment, e.g. in `.env.local`:
 *   MONGODB_URI=mongodb+srv://user:password@cluster/dbname
 */
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Fail fast if the connection string is missing.
 * This throws during app boot so you don’t accidentally
 * run the app with a misconfigured database.
 */
if (!MONGODB_URI) {
  throw new Error('Invalid or missing environment variable: "MONGODB_URI"');
}

/**
 * Shape of the cached Mongoose connection state.
 * We cache both the resolved connection (`conn`) and the
 * in-flight connection promise (`promise`) to avoid creating
 * multiple connections during hot-reloads in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the Node.js global type so TypeScript knows about our cache.
 *
 * We attach the cache to `global` (Node.js global scope) so it
 * persists across HMR reloads in Next.js dev mode.
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

/**
 * Helper to access the global object with a typed `_mongooseCache` property.
 */
const globalForMongoose = global as typeof global & {
  _mongooseCache?: MongooseCache;
};

/**
 * Initialize the cache if it doesn't exist yet.
 * In production this will run only once per server instance.
 * In development it prevents creating new connections on every reload.
 */
const cached: MongooseCache =
  globalForMongoose._mongooseCache ??
  (globalForMongoose._mongooseCache = { conn: null, promise: null });

/**
 * Establishes (or reuses) a Mongoose connection to MongoDB.
 *
 * - Reuses an existing connection if available.
 * - Reuses an in-flight connection promise if a connection is currently being established.
 * - Creates a new connection only when necessary.
 *
 * Call this function from server-only code (API routes, route handlers,
 * server actions, etc). Mongoose does not support the Edge runtime.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If a connection was already established, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is already in progress, reuse the same promise.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Disable mongoose's internal buffering; rely on MongoDB driver instead.
      bufferCommands: false,
      // You can add other options here (e.g. autoIndex, maxPoolSize) if needed.
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise so a future call can retry.
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
