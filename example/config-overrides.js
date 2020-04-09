const { addBabelPlugin } = require("customize-cra");
const { resolve } = require("path");
const { addStoryUiConfig } = require("storyui/addUibook");

module.exports = function override(config, env) {
  // optional
  // add this plugin to get automatic docs for component
  config = addBabelPlugin([
    "babel-plugin-react-docgen",
    {
      removeMethods: true,
      "handlers:": ["defaultPropsHandler"]
    }
  ])(config);
  // required
  config = addStoryUiConfig({
    setupFilePath: resolve(__dirname, "./src/setupStories.js")
  })(config);
  return config;
};
