import express from "express";
const app = express();

// parse JSON bodies
app.use(express.json());

app.get('/', (req, res)=>{
    res.send(`Tic Tac Toe Game Project`);
});

export default app;