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
        nickname.disabled = true;
        nicknameSend.disabled = true;
        text.disabled = true;

        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener('click', () => {
            open.disabled = true;
            nickname.disabled = false;
            nicknameSend.disabled = false;
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

            socket.on('user check', (check,userName) => {
                if(check === "free"){
                nickname.disabled = true;
                nicknameSend.disabled = true;
                send.disabled = false;
                text.disabled = false;
                socket.emit('new user', userName);
                socket.emit('chat history');
                }
                else{
                    alert("Nick zajęty");
                }
            });

            socket.on('echo', (data) => {
                let messageLi = document.createElement('li');
                  messageLi.innerHTML = `${data.user}: ${data.text}`;
                  message.appendChild(messageLi);
            });

            socket.on('new message', (data) => {
                let messageLi = document.createElement('li');
                  messageLi.innerHTML = `${data.user}: ${data.text}`;
                  message.appendChild(messageLi);
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
            socket.emit('user check', nickname.value);
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            let message = {user: nickname.value, text: text.value};
            socket.emit('message', message);
            console.log(`Wysłałem wiadomość: „${text.value}”`);
            text.value = '';
        });
    }
};