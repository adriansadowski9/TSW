/*jshint node: true, esversion: 6 */
const http            = require('http');
const connect         = require('connect');
const serveStatic     = require('serve-static');
const WebSocketServer = require('ws').Server;

const app = connect();
app.use(serveStatic('public'));

const httpServer = http.createServer(app);
const wsServer = new WebSocketServer({
    server: httpServer
});

let history = [];

wsServer.on('connection', (ws) => {
    console.log(`Otwieramy połączenie przez WS`);
    ws.on('message', (message) => {
        history.push(message);
        console.log(`Historia: ${history}`);
        ws.send(message);
    });
    ws.on('close', () => {
        console.log('Zamykamy połączenie przez WS.');
    });
    ws.on('error', () => {
    	console.log(`Błąd: IP: ${ipAddr}`);
    });
});

httpServer.listen(3000, () => {
    console.log('Serwer HTTP działa na porcie 3000');
});
