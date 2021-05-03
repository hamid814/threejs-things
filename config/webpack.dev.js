const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common');

module.exports = merge(commonConfiguration, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    public: 'http://localhost:8080',
    contentBase: './dist',
    open: true,
    https: false,
    useLocalIp: true,
  },
});
