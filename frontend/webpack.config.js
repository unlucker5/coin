const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports ={
    entry: './src/js/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        port: 8000,
        hot: true,
        historyApiFallback: true,
      },
      module: {
        rules: [
        ],
      },
      plugins: [
        new htmlWebpackPlugin({
          title:'coin.',
          minify: true,
          template: './index.html'
        }),
      ],
      optimization: {
      },
}
