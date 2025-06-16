import { log } from 'console';
import mongoose from 'mongoose';

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI)  
    .then(() => {
        console.log('MongoDB connected successfully');
        console.log('Host Name:', mongoose.connection.host);
        
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    });
} 

export default connectDB;

