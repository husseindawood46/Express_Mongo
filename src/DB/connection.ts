import mongoose from 'mongoose';
export const connectionToDB = () => {
  const connectDB = mongoose
    .connect(`${process.env.DB_URL}`)
    .then(() => {
      console.log('Connected to the database successfully!');
    })
    .catch((err) => {
      console.log('Error connecting to the database:', err);
    });
};
