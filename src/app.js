import express from 'express'

// cookie-parser helps in accessing user's cookies which are in browser fro server. and using that we can perform crud operadtion.
import cookieParser from 'cookie-parser';

const app = express();

// setting up a limit when recieving data from front-end 
app.use(express.json({ limit: "16kb" }))
// when recieving data from front-end through URL, we are telling the express to read the data from URL, which may contain some special charecter. Extended: true help in recievig data in nested object too and then we are setting up a data limit.  
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// read secured cookies present in user's browser from server (only server can read these cookies and use it).
app.use(cookieParser())



// import routes
import userRouter from "./routes/user.routes.js"
import bookRouter from "./routes/book.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/books", bookRouter)



export { app }
