const WebSocket = require('ws');

class SocketClient {
  constructor(path, baseUrl) {
    this.baseUrl = baseUrl || 'wss://stream.binance.com/';
    this._path = path;
    this._createSocket();
    this._handlers = new Map();
  }

  _createSocket() {
    this._ws = new WebSocket(`${this.baseUrl}${this._path}`);

    this._ws.onopen = () => {
      console.info('Connected to stream...');
    };

    this._ws.on('pong', () => {
      // console.debug('receieved pong from server');
    });

    this._ws.on('ping', () => {
      // console.debug('==========receieved ping from server');
      this._ws.pong();
    });

    this._ws.onclose = () => {
      console.warn('ws closed');
    };

    this._ws.onerror = (err) => {
      console.warn('ws error', err);
    };

    this._ws.onmessage = (msg) => {
      try {
        const message = JSON.parse(msg.data);
        if (this.isMultiStream(message)) {
          this._handlers.get(message.stream).forEach(cb => cb(message));
        } else if (message.e && this._handlers.has(message.e)) {
          this._handlers.get(message.e).forEach(cb => {
            cb(message);
          });
        } else {
          console.warn('Unknown method', message);
        }
      } catch (e) {
        console.warn('Parse message failed', e);
      }
    };

    this.heartBeat();
  }

  isMultiStream(message) {
    return message.stream && this._handlers.has(message.stream);
  }

  heartBeat() {
    setInterval(() => {
      if (this._ws.readyState === WebSocket.OPEN) {
        this._ws.ping();
        // console.debug("Ping server");
      }
    }, 5000);
  }

  setHandler(method, callback) {
    if (!this._handlers.has(method)) {
      this._handlers.set(method, []);
    }
    this._handlers.get(method).push(callback);
  }
}

module.exports = SocketClient;