import dotenv from 'dotenv';
console.log(process.env.MONGOOSE_URL);
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userAuthContentsRouter from './routes/userAuthContents';
import shareRouter from './routes/share';

import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

const app = express();



//app.use(cors());

// const corsOptions = {
//   origin: 'http://localhost:5173',
//   methods: 'GET,POST,PUT,DELETE', // Allow specific headers
//   optionsSuccessStatus: 200, // Some browsers (like Safari) send a 204 by default, which can cause issues.
// };

app.use(cors({
  origin: process.env.FRONTEND_URL,  // Ensure this is 'http://localhost:5173' in your case
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true,  // Allow cookies and authorization headers
  optionsSuccessStatus: 200,  // Some browsers (e.g., Safari) may require a 200 status for the OPTIONS preflight
}));

app.options('*', cors());



// app.use(express.json());
// app.use(cookieParser());
// const corsOptions = {
//   origin: 'http://localhost:5175',
// }
// app.use(cors(corsOptions));
// app.use((req, res, next) => { 
//   res.header("Access-Control-Allow-Origin", "http://localhost:5175"); 
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
//   next(); 
// });
//app.use(cors({ origin: 'http://localhost:5175' }));
// app.use(
//   cors({
//     origin: ["http://localhost:5175"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: false,
//   })
  
// );

app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("<h1>Server is in running mode...</h1>");
  });

  console.log("hIii helloooo");
  console.log("hi modda gududv");
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

app.use("/api/v1", userAuthContentsRouter);

app.use("/api/v1/brain",shareRouter);


async function main(){
    
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      } as mongoose.ConnectOptions).then(()=>{
      console.log("Connected to MongoDB");
      app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
    });
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
}
}

main();