import express from "express";
import authRouter from "./auth/auth.routes.js";
const app = express();

// parse JSON bodies
app.use(express.json());

// routes
app.use('/auth', authRouter);

app.get('/', (req, res)=>{
    res.send(`Tic Tac Toe Game Project`);
});

export default app;