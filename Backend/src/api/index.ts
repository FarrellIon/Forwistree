import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import databaseRoutes from "./routes/database";
import connectDB from "./database";
import cors from 'cors';

//Database Connection
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3001;

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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/src/api/database', databaseRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});