const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  bail: isProduction,
  context: path.join(__dirname),
  entry: {
    src: [
      isDevelopment && 'react-hot-loader/patch',
      './index.jsx',
    ].filter(Boolean),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrcRoots: ['.', '../'],
              plugins: [isDevelopment && 'react-hot-loader/babel'].filter(Boolean),
            },
          },
        ],
      },
      isDevelopment && {
        test: /\.jsx?$/,
        include: /node_modules\/react-dom/,
        use: 'react-hot-loader/webpack',
      },
      {
        test: /\.less$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.pdf$/,
        use: 'url-loader',
      },
    ].filter(Boolean),
  },
  plugins: [
    new CopyWebpackPlugin([
      'test.pdf',
      { from: 'node_modules/pdfjs-dist/cmaps/', to: 'cmaps/' },
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    isProduction && new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[name].[chunkhash:8].css',
    }),
  ].filter(Boolean),
  optimization: {
    moduleIds: 'named',
  },
  stats: {
    assetsSort: '!size',
    entrypoints: false,
  },
  devServer: {
    compress: true,
    historyApiFallback: true, // respond to 404s with index.html
    host: 'localhost',
    hot: true, // enable HMR on the server
    port: 3000,
  },
};
