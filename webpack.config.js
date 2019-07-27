var path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/PlayBlackJack.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'node'
};