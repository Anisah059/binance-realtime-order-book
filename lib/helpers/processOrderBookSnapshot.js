const Big = require('big.js');
const {
  uniqBy, filter, cond, equals, sort,
} = require('ramda');
const appendUpdatedId = require('./appendUpdatedId');

const processOrderBookSnapshot = (orderBookData, snapshotOrderbook) => {
  const { lastUpdateId, bids, asks } = snapshotOrderbook;

  // clean the order that is out of date
  const cleanOutOfDateOrder = (order) => order[2] > lastUpdateId;
  orderBookData.bid = filter(cleanOutOfDateOrder, orderBookData.bid);
  orderBookData.ask = filter(cleanOutOfDateOrder, orderBookData.ask);

  // append the updateId into snapshotOrderbook
  const snapshotOrders = appendUpdatedId(lastUpdateId, asks, bids);
  const compareValueFn = cond([
    [equals('ask'), () => (a, b) => (new Big(a[0])).minus(b[0])],
    [equals('bid'), () => (a, b) => (new Big(b[0])).minus(a[0])],
  ]);

  const validateValue = (v) => Big(v[0]);
  orderBookData.bid = uniqBy(validateValue, [...snapshotOrders[1], ...orderBookData.bid])
    .sort(compareValueFn('bid'), orderBookData.bid);

  orderBookData.ask = uniqBy(validateValue, [...snapshotOrders[0], ...orderBookData.ask])
    .sort(compareValueFn('ask'), orderBookData.ask);


  return orderBookData;
};

module.exports = processOrderBookSnapshot;