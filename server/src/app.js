import express from 'express';
import cookiesParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Use morgan middleware with the "dev" format
app.use(morgan("dev"));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({ extended: true, limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookiesParser());


//routes imports

import user_routes from "./routes/user.route.js";

//routes declaration
app.use('/api/v1/users', user_routes);


export { app };
