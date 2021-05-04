const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebPackPlugin = require('html-webpack-plugin');
const hbs = require('handlebars');
const { getfileNames, getHbs } = require('../fileNames');

const htmlsFiles = getHbs();

console.log(htmlsFiles);

const jsEntries = {};

getfileNames().forEach((name) => {
  jsEntries[name] = path.join(__dirname, `../src/sketches/${name}/${name}.js`);
});

console.log(getfileNames());

const HTMLEntries = [];

getfileNames().forEach((name) => {
  HTMLEntries.push(
    new HTMLWebPackPlugin({
      template: path.join(__dirname, `../src/sketches/${name}/${name}.hbs`),
      // template: path.join(__dirname, `../src/html/fallback.hbs`),
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../src/textures'),
          to: path.join(__dirname, '../dist/textures'),
        },
      ],
    }),
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
      // HTML
      {
        test: /\.hbs$/,
        use: ['handlebars-loader'],
      },

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

      // Shaders
      {
        test: /\.(glsl|vs|fs|vert|frag)$/,
        exclude: /node_modules/,
        use: ['raw-loader', 'glslify-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
