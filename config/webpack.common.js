const path = require('path');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const { getfileNames } = require('../fileNames');

const jsEntries = {};

getfileNames().forEach((file) => {
  jsEntries[file] = path.join(__dirname, '../src/sketches/' + file + '.js');
});

const HTMLEntries = [];

getfileNames().forEach((name) => {
  HTMLEntries.push(
    new HTMLWebPackPlugin({
      template: path.join(__dirname, '../src/sketches/template.html'),
      minify: true,
      filename: name + '.html',
      title: name.replace('-', ' '),
      chunks: [name],
    })
  );
});

module.exports = {
  entry: {
    index: path.resolve(__dirname, '../src/index.js'),
    ...jsEntries,
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist'),
  },
  plugins: [
    new HTMLWebPackPlugin({
      template: path.join(__dirname, '../src/index.html'),
      minify: true,
      filename: 'index.html',
      chunks: ['index'],
    }),
    ...HTMLEntries,
  ],
  module: {
    rules: [
      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      // css
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
