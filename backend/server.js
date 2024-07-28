import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
// Routes
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import postRoute from './routes/post.js';
import NotificationRoute from './routes/notification.js';
// Database(MongoDB)
import connectMongoDB from './db/connectMongoDB.js';

// Load environment variables from .env file
dotenv.config();

// Connect to my Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;



// Increase the payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '50mb' })); // To parse req.body but do not too large due to DoS attack
app.use(express.urlencoded({ extended: true })); // To parse from data
app.use(cookieParser());

// Use routes imported
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/notifications', NotificationRoute);

// Start the server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});

