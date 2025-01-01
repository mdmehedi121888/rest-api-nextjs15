import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Database is already connected");
        return;
    }
    if(connectionState === 2) {
        console.log("Database is connecting");
        return;
    }

    try{
        await mongoose.connect(MONGODB_URI!,{
            dbName: "nextjs-crud-api",
            bufferCommands: true,
        })
        console.log("Database connected");
    }
    catch(err){
        console.error(err);
        throw new Error("Database connection failed");
    }
};


export default connect;