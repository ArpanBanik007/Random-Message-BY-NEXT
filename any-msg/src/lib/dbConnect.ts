import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB is already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    connection.isConnected = db.connections[0].readyState;

    console.log(
      `MongoDB connected successfully !! DB host: ${db.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

export default dbConnect;