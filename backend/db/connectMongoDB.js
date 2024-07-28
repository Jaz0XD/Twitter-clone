import mongoose from 'mongoose';

const connectMongoDB = async () => {
  if (!mongoose.connection.readyState) {
    try {
      const connect = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
      process.exit(1);
    }
  }
};

export default connectMongoDB;
