// imports
import express from "express";
import cors from "cors";
import morgan from "morgan";

// init express
const app = express();
const port = 3001;
app.use(morgan('dev'));
app.use(express.json());
// use cors to prevent browser from blocking requests to backend as there are 2 servers
app.use(cors({
  origin: 'http://localhost:5173',  // allow only this origin
  credentials: true                 // necessary for cookies
}));

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});