const { spotPublicRequest } = require('../requestClient');

const getOrderBookSnapshot = (symbol) => spotPublicRequest()
  .get(`/api/v1/depth?limit=100&symbol=${symbol}`)
  .then(({ data }) => data);

module.exports = getOrderBookSnapshot;