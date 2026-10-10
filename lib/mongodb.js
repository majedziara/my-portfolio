import { MongoClient } from "mongodb";

// Reuse the connection pool across requests and development hot reloads.
let clientPromise;
export async function getMongoClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add MONGODB_URI to the deployment environment.");
  const cached = process.env.NODE_ENV === "development" ? global._mongoClientPromise : clientPromise;
  if (cached) return cached;
  const promise = new MongoClient(uri, { maxPoolSize: 10, serverSelectionTimeoutMS: 10000 }).connect().catch((error) => {
    clientPromise = undefined;
    if (process.env.NODE_ENV === "development") global._mongoClientPromise = undefined;
    throw error;
  });
  if (process.env.NODE_ENV === "development") global._mongoClientPromise = promise;
  else clientPromise = promise;
  return promise;
}
