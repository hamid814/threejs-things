const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(commonConfiguration, {
  mode: 'production',
  plugins: [new CleanWebpackPlugin(), new CompressionPlugin()],
});
