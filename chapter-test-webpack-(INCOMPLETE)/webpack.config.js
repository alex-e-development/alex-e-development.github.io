const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.m?[jt]sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              // "@babel/preset-typescript"
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      { test: /\.tsx?$/, use: "ts-loader" },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Also generate a test.html
      // filename: 'test.html',
      template: "index.html",
    }),
  ],
  optimization: {
    usedExports: true,
    minimize: false,
    innerGraph: true,
  },
};
