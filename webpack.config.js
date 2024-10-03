const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = isProduction
   ? MiniCssExtractPlugin.loader
   : "style-loader";

const config = {
   entry: path.resolve(__dirname, "src", "index.ts"),
   devtool: "inline-source-map",
   output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "bundle"),
      clean: true,
   },
   devServer: {
      open: true,
      host: "localhost",
      port: 9090,
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: path.resolve(__dirname, "src", "index.html"),
      }),
      new MiniCssExtractPlugin(),
   ],
   module: {
      rules: [
         {
            test: /\.(ts|tsx)$/i,
            loader: "ts-loader",
            exclude: ["/node_modules/"],
         },
         {
            test: /\.(js|jsx)$/i,
            loader: "babel-loader",
            exclude: /node_modules/,
         },
         {
            test: /\.css$/i,
            use: [stylesHandler, "css-loader"],
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: "asset/inline",
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: "asset/resource",
         },
      ],
   },
   resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
   },
};

module.exports = () => {
   if (isProduction) {
      config.mode = "production";

      config.plugins.push(new MiniCssExtractPlugin());

      config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
   } else {
      config.mode = "development";
   }
   return config;
};
