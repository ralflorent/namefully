const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        index: './example/example.ts',
    },
    output: {
        path: path.join(__dirname, '/dist/example'),
        filename: '[name].js',
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, 'src'), path.join(__dirname, 'example')],
        extensions: ['.js', '.ts'],
        plugins: [new TsconfigPathsPlugin()],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                use: 'ts-loader',
            },
        ],
    },
}
