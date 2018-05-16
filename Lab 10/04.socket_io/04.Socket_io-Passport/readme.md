# Uruchamianie serwera
```bash
node serwer.js
```
Jeśli chcemy mieć dostęp do szczegółowych informacji na poziomie `DEBUG`, to zamiast powyższego powinniśmy uzyć:
```bash
DEBUG=* node serwer.js
```
Jeśli interesują nas jedynie informacje na temat `Socket.io` to:
```bash
DEBUG=socket* node serwer.js
```
Jeśli dodatkowo chcemy również podejrzeć niskopoziomowe informacje na temat `Websockets` to:
```bash
DEBUG=socket*,engine:ws node serwer.js
```

Uwaga! Przykład wymaga serwera *Redis*.

