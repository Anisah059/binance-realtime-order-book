const axios = require('axios');

const getRequestInstance = (config) => {
  return axios.create({
    ...config,
  });
};

module.exports = getRequestInstance;