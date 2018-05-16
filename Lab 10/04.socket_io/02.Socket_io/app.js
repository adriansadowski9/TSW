//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');
    socket.on('new user',(userName) =>{
        socket.user = userName;
        });
    socket.on('message', (data) => {
        socket.emit('echo', `${socket.user}: ${data}`);
        socket.broadcast.emit('new message',`${socket.user}: ${data}`);
    });

    socket.on('disconnect', () => {
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
