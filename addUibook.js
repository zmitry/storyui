const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");
const { isObject } = require("lodash");
module.exports.addStoryUiConfig = ({
  setupFilePath,
  templatePath = resolve(__dirname, "./template.html"),
  outputPath = "./storyui.html"
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
        storyui: setup
      };
    } else {
      config.entry.storyui = setup;
    }
    config.plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        chunks: ["storyui"],
        template: templatePath,
        filename: outputPath
      })
    );
    return config;
  };
};
