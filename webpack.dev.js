const merge = require("webpack-merge");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require("./webpack.common");

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

module.exports = merge(common, {
  mode: "development",

  output: {
    filename: "[name].js",
    chunkFilename: "[id].css"
  },

  devServer: {
    port: process.env.PORT || 3000,
    contentBase: path.join(process.cwd(), "./dist"),
    watchContentBase: true,
    quiet: false,
    open: true,
    historyApiFallback: {
      rewrites: [{from: /./, to: "404.html"}]
    }
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "dist/**/*.js",
        "dist/**/*.css",
        "site/data/webpack.json"
      ]}),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
});
