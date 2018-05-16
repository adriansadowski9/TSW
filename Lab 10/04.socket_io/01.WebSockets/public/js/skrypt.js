/*jshint browser: true, esversion: 6, globalstrict: true */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
		let status  = document.getElementById('status');
		let open    = document.getElementById('open');
		let close   = document.getElementById('close');
		let send    = document.getElementById('send');
		let text    = document.getElementById('text');
		let message = document.getElementById('message');
		let socket;

		status.textContent = 'Brak połącznia';
		close.disabled = true;
		send.disabled = true;
		// Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
		open.addEventListener('click', () => {
			open.disabled = true;
			socket = new WebSocket(`ws://${location.host}`);
			socket.addEventListener('open', () => {
				close.disabled = false;
				send.disabled = false;
				status.src = 'img/bullet_green.png';
			});
			socket.addEventListener('close', () => {
				console.log('Rozłączenie');
				open.disabled = false;
				status.src = 'img/bullet_red.png';
			});
			socket.addEventListener('message', (msg) => {
				message.textContent = `Serwer twierdzi, że otrzymał od Ciebie: „${msg.data}”`;
			});
			socket.addEventListener('error', (err) => {
				console.log('Błąd');
				message.textContent = `Błąd połączenia z serwerem: ${err}`;
				open.disabled = false;
				status.src = 'img/bullet_red.png';
			});
		});
		// Zamknij połączenie po kliknięciu guzika „Rozłącz”
		close.addEventListener('click', () => {
			close.disabled = true;
			send.disabled = true;
			message.textContent = '';
			socket.close();
		});
		// Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
		send.addEventListener('click', () => {
			socket.send(text.value);
			text.value = '';
		});
    }
};