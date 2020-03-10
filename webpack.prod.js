/**
 * Production configuration for the bundler
 *
 * Created on March 10, 2019
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/* Handle OS path resolution: absolute, relative paths */
const path = require('path');

/* To access webpack runtime */
const webpack = require('webpack');

/* Concatenate arrays and merge objects */
const webpackMerge = require('webpack-merge');

/* Cleaner for the context path: .dist/ (no need for rimraf) */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/* Minimizer */
const TerserJSPlugin = require('terser-webpack-plugin');

/* Common configuration shared between development and production environment */
const commonConfig = require('./webpack.common.js');

// Merge this with common configuration
module.exports = webpackMerge(commonConfig, {

    mode: 'production',
    devtool: 'source-map',

    entry: {
        'namefully.min': './src/index.ts'
    },

    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'namefully',
        umdNamedDefine: true
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({
                include: /\.min\.js$/,
            }),
        ],
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CleanWebpackPlugin(),
    ]
});