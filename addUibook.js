const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const { isObject } = require("lodash");
module.exports.addUiBook = ({
  setupFilePath,
  templatePath = resolve(__dirname, "./uibook.template.html"),
  outputPath = "./uibook.html"
}) => {
  return function(config, env) {
    const setup = [setupFilePath];
    if (config.mode === "development") {
      setup.unshift(require.resolve("react-dev-utils/webpackHotDevClient"));
    }
    config.output.filename = "static/js/[name].js";
    if (isObject(config.entry)) {
      config.entry = {
        main: config.entry,
        uibook: setup
      };
    } else {
      config.entry.uibook = setup;
    }
    config.plugins.push(
      new HtmlWebpackPlugin({
        chunks: ["uibook"],
        template: templatePath,
        filename: outputPath
      })
    );
    return config;
  };
};
