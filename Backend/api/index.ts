import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./database";
import ConnectMongo from "connect-mongo";
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';

//Routes
import databaseRoutes from "./routes/database";
import authRoute from "./routes/auth";
import { Admins } from "./database/schemas/admin/admins";
import { decryptString } from "./utils/encryption";

//Database Connection
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

//Connect to MongoDB
const startDB = async () => {
    try {
        await connectDB(process.env.DB_URL!);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}
startDB();

//Cors, Form Handler
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport and Session
app.use(session({
    secret: process.env.SESSION_KEY!,
    resave: false,
    saveUninitialized: false,
    store: ConnectMongo.create({
        mongoUrl: process.env.DB_URL
    }),
}));
app.use(passport.initialize());
app.use(passport.session());
require('./strategies/local');

//Auth Routes
app.use('/api/auth', authRoute);

//Check if Logged In
function ensureAuthenticated(req: Request, res: Response, next: () => any) {
    if (req.isAuthenticated() || req.headers.uservalue) {
        if(req.headers.uservalue){
            const admin = Admins.findById({ id: decryptString(req.headers.uservalue as string) });

            if(!admin){
                res.status(400).send('User tidak ditemukan');
            }
        }
        return next();
    }else{
        res.status(400).send('Belum login');
    }
}

//Other Routes
app.use('/api/database', ensureAuthenticated, databaseRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});