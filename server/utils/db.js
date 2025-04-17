import { MongoClient } from "mongodb";

let dbInstance = null;

const connectDB = async () => {
    try {
        const connectionString = "mongodb://mongoadmin:secret123@localhost:27017"; 
        const client = new MongoClient(connectionString);

        await client.connect();
        console.log("MongoDB Connected");

        dbInstance = client.db("practice-mongo"); 
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};


const getDb = () => {
    if (!dbInstance) {
        throw new Error("Database not connected. Call connectDB first.");
    }
    return dbInstance;
};

export { connectDB, getDb };
