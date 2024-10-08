import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri:any = process.env.MONGODB_URI;


const connectDB = async () => {
    console.log("checking", process.env.MONGODB_URI);
  try {
    await mongoose.connect(uri, {
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;