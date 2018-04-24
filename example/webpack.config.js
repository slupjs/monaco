const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const { join } = require('path')

module.exports = {
  mode: 'development',
  entry: {
    app: join(__dirname, 'index'),
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker',
    'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
    'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
    'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
    'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
  },

  output: {
    globalObject: 'self',
    filename: '[name].bundle.js',
    path: join(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/,
        use: 'babel-loader' 
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },

  plugins: [
    new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/)
  ]
}