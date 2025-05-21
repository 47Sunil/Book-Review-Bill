import { app } from "./app.js"
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({
    path: './.env'
})

//db connection
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        // console.log("connectionInstance:: ", connectionInstance);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("mongo db connection error: ", error)
        process.exit(1)
    }
}

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`server is running on ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('mongodb connection failed !!! ', err)
    })



// server check
app.get('/', (req, res) => {
    res.send('Book Review system is running!')
})
