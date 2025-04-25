
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new CopyPlugin({
      patterns: [
        //{ from: 'src/*.php', to: '[name][ext]' },
        { from: 'src/assets/images', to: 'assets/images' },
        { from: 'src/assets/audio', to: 'assets/audio' },
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icono-192x192.png', to: 'icono-192x192.png' }, // ← 🔥 Añade esta línea
        { from: 'src/assets/css', to: 'assets/css' },

      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, 'src/assets/css'),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][hash][ext]',
        },
        include: path.resolve(__dirname, 'src/assets/images'),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[hash][ext][query]',
        },
      },
      {
        test: /\.json$/,
        type: 'json',
        include: [path.resolve(__dirname, 'src')],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    open: true, // <-- Abre automáticamente el navegador
    proxy: {
      '/api': {
        target: 'http://localhost', // Asegúrate de que el servidor PHP esté en ese puerto
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
