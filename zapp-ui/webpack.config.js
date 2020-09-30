const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'zapp-ui.js',
    libraryTarget: 'umd',
    library: 'zappUI',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@zextras/zapp-ui': path.resolve(__dirname, './src/index.jsx'),
      'zapp-ui-icons': path.resolve(__dirname, './src/icons/index.jsx')
    }
  },
  externals: [
    'react',
    'prop-types',
    'styled-components'
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};
