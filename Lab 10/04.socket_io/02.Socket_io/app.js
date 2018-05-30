//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

const messages = [];
const users = [];

app.use(serveStatic('public'));

io.sockets.on('connect', (socket) => {
    console.log('Socket.io: połączono.');

    socket.on('user check',(userName)=>{
        let free=1;
        if(userName===""){
            socket.emit('user check',"occupied",userName);
        }
        users.forEach((userAv) =>{
            if(userAv === userName){
                free = 0;
            }
        });
        if(free === 0){
            socket.emit('user check',"occupied",userName);
        }
        else{
            socket.emit('user check',"free",userName);
        }
    });
    
    socket.on('new user',(userName) =>{
        users.push(userName);
        socket.user = userName;
        });

    socket.on('chat history',()=>{
        for(i = 10; i>0; i--){
            socket.emit('echo',messages[messages.length-i]);
        }

    });
    socket.on('message', (data) => {
        messages.push(data);
        socket.emit('echo', data);
        socket.broadcast.emit('new message', data);
    });

    socket.on('disconnect', () => {
        users.forEach((userD) =>{
            if(userD === socket.user){
                users.pop(userD);
            }
        });
        console.log('Socket.io: rozłączono.');
    });
    socket.on('error', (err) => {
        console.dir(err);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});