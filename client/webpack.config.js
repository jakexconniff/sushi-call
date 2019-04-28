const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(path.resolve(__dirname, 'dist'))
module.exports = {
  entry: ['@babel/polyfill', './app/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader'},
      { test: /\.less$/, use: [ 'style-loader', 'css-loader', 'less-loader'] }
    ]
  },
  mode: process.env.NODE_ENV == 'production' ? 'production' : 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ]
};