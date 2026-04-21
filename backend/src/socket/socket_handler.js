import { Server } from 'socket.io';

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

        socket.on('disconnect', ()=>{
            console.log('User disconnected', socket.id);
        });
    });

    return io;
};

export default initSocket;