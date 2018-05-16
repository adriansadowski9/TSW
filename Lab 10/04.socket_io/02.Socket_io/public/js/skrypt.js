//jshint browser: true, esversion: 6, globalstrict: true, devel: true
/* globals io: false */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let status = document.getElementById('status');
        let open = document.getElementById('open');
        let close = document.getElementById('close');
        let send = document.getElementById('send');
        let nickname = document.getElementById('nickname');
        let nicknameSend = document.getElementById('nicknameSend');
        let text = document.getElementById('text');
        let message = document.getElementById('message');
        let socket;

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;

        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener('click', () => {
            open.disabled = true;
            socket = io.connect(`http://${location.host}`);

            socket.on('connect', () => {
                close.disabled = false;
                status.src = 'img/bullet_green.png';
                console.log('Nawiązano połączenie przez Socket.io');
            });
            socket.on('disconnect', () => {
                open.disabled = false;
                status.src = 'img/bullet_red.png';
                console.log('Połączenie przez Socket.io zostało zakończone');
            });
            socket.on('error', (err) => {
                message.textContent = `Błąd połączenia z serwerem: "${JSON.stringify(err)}"`;
            });
            socket.on('echo', (data) => {
                message.textContent = data;
            });

            socket.on('new message', (data) => {
                message.textContent = data;
            });
        });

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener('click', () => {
            close.disabled = true;
            send.disabled = true;
            message.textContent = '';
            socket.disconnect();
        });

        nicknameSend.addEventListener('click', () => {
            nicknameSend.disabled = true;
            socket.emit('new user', nickname.value);
            send.disabled = false;
            console.log(`Login: ${nickname.value}`);
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            socket.emit('message', text.value);
            console.log(`Wysłałem wiadomość: „${text.value}”`);
            text.value = '';
        });
    }
};