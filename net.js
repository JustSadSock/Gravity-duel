// net.js

/**
 * Простой WebSocket-клиент для онлайн-дуэлей.
 */

let socket = null;
let flipHandler = null;
let scoreHandler = null;

/**
 * Подключается к серверу.
 * @param {string} roomId — идентификатор комнаты (например, 'room123')
 * @param {string} [url] — адрес WS-сервера (без roomId)
 */
export function connect(roomId, url = 'wss://yourserver.com') {
  socket = new WebSocket(`${url}/ws/${roomId}`);

  socket.addEventListener('open', () => {
    console.log('WS connected');
  });

  socket.addEventListener('message', ev => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      return;
    }
    if (msg.type === 'flip' && flipHandler) {
      flipHandler(msg.player, msg.timestamp);
    }
    if (msg.type === 'score' && scoreHandler) {
      scoreHandler(msg.scorer);
    }
  });

  socket.addEventListener('close', () => {
    console.log('WS disconnected');
  });
}

/**
 * Функция-колбэк при получении флипа от оппонента.
 * @param {(player: 'A'|'B', timestamp: number)=>void} cb
 */
export function onFlip(cb) {
  flipHandler = cb;
}

/**
 * Функция-колбэк при получении события гола.
 * @param {(scorer: 'A'|'B')=>void} cb
 */
export function onScore(cb) {
  scoreHandler = cb;
}

/**
 * Отправляет сообщение о смене гравитации.
 * @param {'A'|'B'} player
 */
export function sendFlip(player) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({
    type: 'flip',
    player,
    timestamp: Date.now()
  }));
}

/**
 * Отправляет сообщение о голе.
 * @param {'A'|'B'} scorer
 */
export function sendScore(scorer) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({
    type: 'score',
    scorer,
    timestamp: Date.now()
  }));
}

/**
 * Закрывает соединение.
 */
export function disconnect() {
  if (socket) socket.close();
  socket = null;
}
