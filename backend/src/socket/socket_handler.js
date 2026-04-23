import { Server } from 'socket.io';
import rooms from '../game/game.state.js';

function initSocket(server){
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    console.log("Socket.io initialized ");

    io.on('connection', (socket)=>{
        console.log(`User connected`, socket.id);

        socket.on('test_event', (data)=>{
            console.log('Received from client', data);

            socket.emit('test_response', {
                message: 'Socket working',
                data
            });
        });

        socket.on('set_username', (name)=>{
            socket.username = name;
        });

        // create room
        socket.on("create_room", () => {
            const roomId = Math.random().toString(36).substring(2, 8);

            const room = {
                roomId,
                players: [
                    { socketId: socket.id, symbol: "X" }
                ],
                status: "waiting"
            };

            rooms.set(roomId, room);

            socket.join(roomId);

            socket.emit("room_created", {
                roomId,
                symbol: "X"
            });
        });

        // Join Room
        socket.on('join_room', ({ roomId })=>{
            const room = rooms.get(roomId);

            if(!room){
                return socket.emit('error', { message: 'Room not found.' });
            }

            if(room.players.length >=2){
                return socket.emit('error', { message: "Room is full." });
            }

            room.players.push({
                socketId: socket.id,
                symbol: 'O'
            });

            room.status = 'full';

            socket.join(roomId);

            io.to(roomId).emit('room_joined', {
                room
            });
        });

        socket.on('disconnect', ()=>{
            console.log('User disconnected', socket.id);
        });
    });

    return io;
};

export default initSocket;