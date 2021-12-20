//  const debug = process.env.NODE_ENV !== 'production';

const path = require('path');
const webpack = require('webpack');

// const HtmlWebPackPlugin = require('html-webpack-plugin');
// const HtmlWebPackPluginConfig = new HtmlWebPackPlugin({ template: 'index.html' });

require('webpack');
require('script-loader');

module.exports = {
    context: __dirname,
    entry: { app: './app/app.module.js' },
    output: {
        path: path.resolve(__dirname, 'pages'),
        filename: 'js/[name].min.js',
        publicPath: 'pages/'
    },
    module: {
        rules: [
            {
                test: /\.exec\.js$/,
                use: ['script-loader']
            },

            {
                test: /\.js$/,
                exclude: /(node_modules | pages | scripts |dist)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        compact: true }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            }
        ]
    },
 devtool: 'source-map', // debug ? 'inline-sourcemap' : null,
    // entry: './scripts/app.js',
  /* entry: './app/app.module.js',
  output: {
    path: path.join(__dirname, '/app'),
    filename: 'app.min.js'
  },*/
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         include: /\.min\.js$/,
    //         minimize: true
    //     })
    // // , CleanWebpackPluginConfig
    // ]
};
