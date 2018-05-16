//jshint node: true, esversion: 6
const connect = require('connect');
const app = connect();
const serveStatic = require('serve-static');

const httpServer = require('http').createServer(app);

const socketio = require('socket.io');
const io = socketio.listen(httpServer);

app.use(serveStatic('public'));

// io.set('heartbeat timeout', 10);
// io.set('heartbeat interval', 10);

const chat = io
    .of('/chat')
    .on('connect', (socket) => {
    	console.log('Uruchomiłem kanał „/chat”');
        socket.on('message', (data) => {
            console.log(`/chat: ${data}`);
            socket.emit('message', `/chat: ${data}`);
        });
    });

const news = io
    .of('/news')
    .on('connect', (socket) => {
        console.log('Uruchomiłem kanał „/news”');
        socket.on('message', (data) => {
            console.log(`/news: ${data}`);
        	socket.emit('message', `/news: ${data}`);
        });
    });

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na pocie 3000');
});
