const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
  name: 'namefully',
  mode: 'production',
  devtool: 'source-map',
  entry: {
    namefully: './src/index.ts',
    'namefully.min': './src/index.ts',
  },
  output: {
    path: path.join(__dirname, '/dist/umd'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'namefully',
    umdNamedDefine: true,
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')],
    extensions: ['.js', '.ts'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({ include: /\.min\.js$/ })],
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
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new CleanWebpackPlugin()],
};
