const { resolve } = require("path");
const { isObject } = require("lodash");
module.exports.addStoryUiConfig = ({
  setupFilePath,
  templatePath = resolve(__dirname, "./template.html"),
  outputPath = "./storyui.html"
}) => {
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  return function(config, env) {
    config.output.filename = "static/js/[name].js";

    const setup = [setupFilePath];
    if (config.mode === "development") {
      setup.unshift(require.resolve("react-dev-utils/webpackHotDevClient"));
    }
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
