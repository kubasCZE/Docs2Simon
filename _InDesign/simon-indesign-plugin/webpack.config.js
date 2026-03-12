const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {
  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      //libraryTarget: "commonjs2"
    },
    devtool: "eval-cheap-source-map", // won't work on XD due to lack of eval
    externals: {
      uxp: "commonjs2 uxp",
      indesign: "commonjs2 indesign",
      os: "commonjs2 os",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            plugins: [
              "@babel/transform-react-jsx",
              "@babel/proposal-object-rest-spread",
              "@babel/plugin-syntax-class-properties",
            ],
          },
        },
        {
          test: /\.png$/,
          exclude: /node_modules/,
          loader: "file-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          env.production ? "production" : env.test ? "test" : "development"
        ),
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
        {
          from: path.resolve(__dirname, "plugin/manifest.json"),
          to: path.resolve(__dirname, "dist"),
        },
      ]),
    ],
  };
};
