import app from "./app.js";
import dbConnection from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import initSocket from "./socket/socket_handler.js";
dotenv.config();


(async ()=>{
    try {
        // db Conection
        await dbConnection();

        // socket connection
        const server = http.createServer(app);
        initSocket(server);
        
        // run server
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, ()=>{
            console.log(`Server is running on PORT ${ PORT }`);
        });
    } catch (err) {
        console.log(`Something went wrong`, err);
    }
})();