
const OrderBook = require('./lib/orderBook');
const SocketClient = require('./lib/socketClient');
const { orderbookUpdateFromWebsocket, orderBookUpdateFromRESTfulAPI } = require('./lib/orderBookManager');

const SYMBOL = process.env.SYMBOL || 'BTCUSDT';

const socketApi = new SocketClient(`ws/${SYMBOL.toLowerCase()}@depth`);

const orderBook = new OrderBook(SYMBOL.toUpperCase());

socketApi.setHandler('depthUpdate', (params) => orderbookUpdateFromWebsocket(params)(orderBook));

// leave a time gap to wait for websocket connection first
setTimeout(() => {
  orderBookUpdateFromRESTfulAPI(orderBook);
}, 3000);

const fetchOrderBook = () => {
  console.log('A');
  return orderBook.inspect();
}

module.exports = {
  fetchOrderBook
};
