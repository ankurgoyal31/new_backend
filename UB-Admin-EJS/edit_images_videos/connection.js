import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.MONGO_URI); // Debugging line to check if MONGO_URI is loaded correctly

const client = new MongoClient(process.env.MONGO_URI);
let db;
async function connectToDatabase() {
    if (!db) {
        console.log("Connecting to database...");
        await client.connect();
        db = client.db("test"); // 👈 yaha check karo naam
        console.log("Database connected");
    } 
    return db.collection("projects"); // 👈 yaha check karo naam
}

export { connectToDatabase };