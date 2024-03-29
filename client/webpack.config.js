const path = require("path");

module.exports = {
  entry: ["./src/index.jsx"],
  output: {
    path: path.resolve(__dirname, "../public/js"),
    filename: "worldcup.js"
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  // devServer: {
  //   contentBase: "./dist"
  // }
};
