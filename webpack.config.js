const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    port: "3000",
    // Change it if other port needs to be used
    hot: true,
    // enable HMR on the server
    noInfo: false,
    quiet: false,
    compress: true,
    // minimize the output to terminal.
    contentBase: path.resolve(__dirname, "dist"),
    // match the output path
    publicPath: "/"
    // match the output `publicPath`
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Sales Knave",
      template: "index.html"
    })
  ]
};
