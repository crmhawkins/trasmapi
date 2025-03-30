// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   mode: 'development',
//   entry: './src/app.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/index.html', // Ruta a tu archivo index.html
//       filename: 'index.html', // Nombre del archivo final en dist
//     }),
//     // ... puedes tener más plugins aquí
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.css$/,
//         use: [
//           'style-loader',
//           'css-loader',
//         ],
//         include: path.resolve(__dirname, './assets/css') // Procesa solo los archivos dentro de /assets/css

//       },
//       {
//         test: /\.(woff|woff2|eot|ttf|otf)$/,
//         use: [
//           {
//             type: 'asset/resource',
//             options: {
//               name: '[name].[ext]',
//               outputPath: 'fonts/', // Los archivos de fuentes se moverán aquí en dist
//             },
//           },
//         ],
//       },
//     ],
//   },
// };

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
        { from: 'src/*.php', to: '[name][ext]' }, // Copia todos los archivos PHP al directorio dist
        { from: 'src/assets/images', to: 'assets/images' }, // Copia todas las imágenes al directorio dist/assets/images
        { from: 'src/assets/audio', to: 'assets/audio' },
    { from: 'src/manifest.json', to: 'manifest.json' },
    // { from: 'src/icons', to: 'icons' }, // Si tienes una carpeta de iconos
        // Añade aquí más patrones si necesitas copiar otros archivos
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
          filename: 'assets/images/[name][hash][ext]', // Asegúrate de que el nombre y el hash estén antes de la extensión del archivo
        },
        include: path.resolve(__dirname, 'src/assets/images'), // Procesa imágenes solo en el directorio src/assets/images
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
        include: [
          path.resolve(__dirname, 'src'),
        ],
      },
      // Si tienes otros tipos de archivos que necesitas manejar, añade más reglas aquí.
    ],
  },
  // Asegúrate de añadir esto si estás usando el servidor de desarrollo de Webpack
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
  devServer: {
    // ... (otras configuraciones del servidor de desarrollo)
    proxy: {
      '/api': { // Suponiendo que todas tus peticiones PHP están bajo un prefijo '/api'
        target: 'http://localhost', // Cambia a la URL donde tu servidor PHP está corriendo
        secure: false,
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Reescribe la ruta si es necesario
      },
    },
  },
};