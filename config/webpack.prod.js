const { merge} = require('webpack-merge');
const baseConfig = require('./webpack.common')

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  devServer: {
    hot: true
  },
  entry: {
    main: {
      import: './src/index.js',
      runtime: 'common-runtime'
    },
    foo: { import: "./src/foo.js", dependOn: "main", },
  }
})