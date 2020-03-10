/**
 * Development configuration for the bundler
 *
 * Created on March 10, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/* Handle OS path resolution: absolute, relative paths */
const path = require('path');

/**
 * Merge this with common configuration
 */
module.exports = {

    mode: 'development',
    devtool: 'inline-source-map',

    entry: {
        'index': './usecases/index.ts',
    },

    output: {
        /* path: used by webpack for generated files */
        path: path.join(__dirname, '/usecases'),
        filename: '[name].js',
    },

    resolve: {
        modules: [
            'node_modules',
            path.join(__dirname, 'src'),
            path.join(__dirname, 'usecases')
        ],
        extensions: ['.js', '.ts'],
    },

    module: {
        // Allows to specify several loaders within the webpack configuration
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: 'ts-loader'
            },
        ]
    },
};
