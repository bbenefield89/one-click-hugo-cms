require('dotenv').config()

const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**/
const fs = require('fs')
const cmsConfigFilePath = path.join(process.cwd(), './site/static/admin/config.yml')  // e.g. ~/dev/one-click-hugo-cms/site/static/admin/config.yml
// this line READS the contents of a file and converts it to human readable utf-8
fs.readFile(cmsConfigFilePath, 'utf-8', (err, data) => {
  if (err) {
    throw new Error(err)  // throw error if any
  }
  // This line takes the file contents and replaces the branch name with an env variable we set in our npm script e.g. "npm run dev"
  fs.writeFile(cmsConfigFilePath, data.replace(/branch: \w+/, `branch: ${process.env.BRANCH}`), (err) => {
    if (err) {
      throw new Error(err)  // throw error if any
    }
  })
})
/**/

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "index.js"),
    cms: path.join(__dirname, "src", "js", "cms.js"),
  },

  output: {
    path: path.join(__dirname, "dist")
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ["style-loader", MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new AssetsPlugin({
      filename: "webpack.json",
      path: path.join(process.cwd(), "site/data"),
      prettyPrint: true
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/fonts/",
        to: "fonts/",
        flatten: true
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'admin/index.html',
      template: 'src/cms.html',
      inject: false,
    }),
  ]
};
