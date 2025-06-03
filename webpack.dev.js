const path = require('path');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: {
    index: './example/main.ts',
    advanced: './example/advanced.ts',
  },
  output: {
    path: path.join(__dirname, '/build/example'),
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src'), path.join(__dirname, 'example')],
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: 'ts-loader',
      },
    ],
  },
};
