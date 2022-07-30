const WebpackRunPlugin = require("./plugins/webpack-run-plugin");
const WebpackDonePlugin = require("./plugins/webpack-done-plugin");
const path = require("path");

module.exports = {
  mode: 'development',
  entry: {
    home: "./src/home.js",
    about: "./src/about.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, "loaders/logger-loader.js"),
          path.resolve(__dirname, "loaders/logger2-loader.js"),
        ],
      },
      {
        test: /\.css$/,
        use: [path.resolve(__dirname, "loaders/style-loader.js")],
      },
    ],
  },
  plugins: [new WebpackRunPlugin(), new WebpackDonePlugin()],
};
