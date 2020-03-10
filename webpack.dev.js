/**
 * Development configuration for the bundler
 *
 * Created on March 10, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/* To access webpack runtime */
const webpack = require('webpack');

/* Handle OS path resolution: absolute, relative paths */
const path = require('path');

/* Concatenate arrays and merge objects */
const webpackMerge = require('webpack-merge');

/* Common configuration shared between development and production environment */
const commonConfig = require('./webpack.common.js');

/**
 * Merge this with common configuration
 */
module.exports = webpackMerge(commonConfig, {

    mode: 'development',
    devtool: 'inline-source-map',

    entry: {
        'index': './src/__usecases__/index.ts',
    },

    output: {
        /* path: used by webpack for generated files */
        path: path.join(__dirname, '/usecases'),
        filename: '[name].js',
    },

    /*  Options passed on the command line (package.json::start) as the dev
     *  server does not have access to the webpack config
     */
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ],
});
