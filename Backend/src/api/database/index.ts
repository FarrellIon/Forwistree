import mongoose from "mongoose";

const connectDB = async (url: string) => {
    mongoose.connect(url, {serverSelectionTimeoutMS: 30000})
    .then(() => console.log('Connected to dB'))
    .catch((err) => console.log(err));
}

export default connectDB;