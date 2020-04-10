const { addBabelPlugin, override } = require("customize-cra");
const { resolve } = require("path");
const { addStoryUiConfig } = require("storyui/addUibook");

module.exports = override(
  addBabelPlugin([
    "babel-plugin-react-docgen",
    {
      removeMethods: true,
      "handlers:": ["defaultPropsHandler"]
    }
  ]),
  addStoryUiConfig({
    setupFilePath: resolve(__dirname, "./src/setupStories.js")
  })
);
