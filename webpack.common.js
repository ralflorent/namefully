/**
 * Common/Shared configuration for the bundler for the development and production
 * environment.
 *
 * Created on March 10, 2020
 * @author Ralph Florent <ralflornt@gmail.com>
 */

/* Use to load specified `tsconfig.json` configuration file  */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

/* Handle OS path resolution: absolute, relative paths */
const path = require('path');

/* Common configuration shared between development and production environment */
module.exports = {
    name: 'namefully',

    // This defines the number of dependency graphs for each entry point to
    // bundle (pack together).
    entry: {
        'index': './src/index.ts',
    },

    // A resolver helps in locating a module by its absolute path
    resolve: {
        modules: ['node_modules', path.join(__dirname, 'src')],
        extensions: ['.js', '.ts'],
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })]
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
}

