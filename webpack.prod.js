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

/* Load modules whose location is specified in the paths section of tsconfig.json */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/* Cleaner for the context path: .dist/ (no need for rimraf) */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/* Minimizer */
const TerserJSPlugin = require('terser-webpack-plugin');

// Merge this with common configuration
module.exports = {
    name: 'namefully',
    mode: 'production',
    devtool: 'source-map',

    entry: {
        'namefully': './src/index.ts',
        'namefully.min': './src/index.ts'
    },

    output: {
        path: path.join(__dirname, '/dist/umd'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'namefully',
        umdNamedDefine: true
    },

    resolve: {
        modules: ['node_modules', path.join(__dirname, 'src')],
        extensions: ['.js', '.ts'],
        plugins: [new TsconfigPathsPlugin()],
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserJSPlugin({
                include: /\.min\.js$/,
            }),
        ],
    },

    module: {
        // Allows to specify several loaders within the webpack configuration
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|usecases)/,
                use: 'ts-loader'
            },
        ]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new CleanWebpackPlugin(),
    ]
};