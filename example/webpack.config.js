const CopyWebpackPlugin = require('copy-webpack-plugin')
const { join } = require('path')

module.exports = {
  entry: join(__dirname, 'index'),
  target: 'web',

  output: {
    filename: 'bundle.js',
    path: __dirname
  },

  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: 'node_modules/monaco-editor/min/vs',
      to: 'vs',
    }])
  ]
}