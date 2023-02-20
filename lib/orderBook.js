const processOrderBookUpdate = require('./helpers/processOrderBookUpdate');
const processOrderBookSnapshot = require('./helpers/processOrderBookSnapshot');

class OrderBook {

  constructor(symbol) {
    this._data = {
      symbol,
      ask: [],
      bid: [],
      lastUpdateId: '',
    };
    this.dataInterval = null;
  }

  getOrderbook() {
    return this._data;
  }

  getSymbol() {
    return this._data.symbol;
  }

  getBestBid() {
    return this._data.bid[0][0];
  }

  getBestAsk() {
    return this._data.ask[0][0];
  }
  justInitialized() {
    return this._data.ask.length === 0;
  }

  updateLastUpdateId(id) {
    this._data.lastUpdateId = id;
  }

  updateOrderbook(ask, bid) {
    this._data = processOrderBookUpdate(this._data, bid, ask);
  }


  updateOrderBookWithSnapshot(snapshot) {
    this._data = processOrderBookSnapshot(this._data, snapshot);
  }

  inspect() {
    return this._data;
  }

  best_price() {
    setInterval(() => {
      if (this._data.ask.length == 0) {
        console.log('waiting for warm up');
        return;
      }
      console.log('Best Ask:', this.getBestAsk());
      console.log('Best Bid:', this.getBestBid());
    }, 1000);
  }
}

module.exports = OrderBook;