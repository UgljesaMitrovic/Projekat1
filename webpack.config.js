const path = require("path");
module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", "./src/index.js"],
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        //kako ce se obraditi fajlovi
        test: /\.js$/, //regularni izraz $-ako se string zavrsava sa tom reci
        exclude: /(node_modules|bower_components)/, //da ne trazi node_modules jer ima mng fajlova
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
