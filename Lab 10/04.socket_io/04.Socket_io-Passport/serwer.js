/*jshint node: true, esversion: 6, devel: true */

// Aplikacja Express.js
const express = require('express');
const app = express();

// mechanizm sesji (wykorzystamy bazę Redis)
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionStore = new RedisStore({
    host: 'localhost',
    port: 6379,
    client: require('redis').createClient(),
    ttl:  260
});

// Passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Socket.io (wraz z modułem autoryzacji poprzez Passport)
const socketIo = require('socket.io');
const passportSocketIo = require('passport.socketio');

// Konfiguracja passport.js
passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (obj, done) => {
    done(null, obj);
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        if ((username === 'admin') && (password === 'tajne')) {
            console.log('Udane logowanie...');
            return done(null, {
                username: username,
                password: password
            });
        } else {
            return done(null, false);
        }
    }
));

// konfiguracji aplikacji Express.js
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

// konfiguracja obsługi sesji (poziom Express,js)
const sessionSecret = 'Wielki$ekret44';
const sessionKey = 'express.sid';
app.use(session({
    key: sessionKey,
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
}));

// middleware Passport.js
app.use(passport.initialize());
app.use(passport.session());
// obsługa zasobów statycznych
app.use(express.static('public'));

// routing („normalnie” powinien wykorzystywać szablony, np. EJS)
app.get('/', (req, res) => {
    let body;
    if (req.user) {
        let username = req.user.username;
        body = `<p>Jesteś zalogowany jako „${username}”</p>
                <a href="/logout">Wyloguj</a>`;
    } else {
        body = '<a href="/login">Zaloguj</a>';
    }
    res.send(`<html><body>${body}</body></html>`);
});
app.get('/login', (req, res) => {
    var body = `
    <html>
    <body>
        <form action="/login" method="post">
            <div>
                <label>Użytkownik:</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>Hasło:</label>
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value="Zaloguj"/>
            </div>
        </form>
    </body>
    </html>`;
    res.send(body);
});
app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login'
    }),
    (req, res) => {
        res.redirect('/authorized.html');
    }
);
app.get('/logout', (req, res) => {
    console.log('Wylogowanie...');
    req.logout();
    res.redirect('/login');
});

// serwer HTTP dla aplikacji „app”
const server = require('http').createServer(app);


// obsługa Socket.io
const sio = socketIo.listen(server);
// konfiguracja passport-socketio
// połączenie od autoryzowanego użytkownika
const onAuthorizeSuccess = (data, accept) => {
    // data – informacje o połączeniu (od Passport.js)
    // accept – funkcja służąca do akceptowania/odrzucania połączenia
    //          odrzucenie: accept(new Error('powód odrzucenia'));
    console.log('Udane połączenie z socket.io');
    accept();
};
// połączenie od nieutoryzowanego użytkownika lub sytuacja błędna
const onAuthorizeFail = (data, message, error, accept) => {
    if (error) { // wystąpił błąd
        throw new Error(message);
    }
    // połączenie nieautoryzowane (ale nie błąd)
    console.log('Nieudane połączenie z socket.io');
    accept(new Error('Brak autoryzacji!'));
};
// passport-socketio jako „middleware” dla Socket.io
sio.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          sessionKey,
    secret:       sessionSecret,
    store:        sessionStore,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}));

sio.sockets.on('connection', (socket) => {
    socket.emit('news', {
        ahoj: 'od serwera'
    });
    socket.on('reply', (data) => {
        console.log(data);
    });
});

server.listen(3000, () => {
    console.log('Serwer pod adresem http://localhost:3000/');
});
