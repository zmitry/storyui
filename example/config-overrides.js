const { addBabelPlugin } = require("customize-cra");
const { resolve } = require("path");
// use installed module
const { addUiBook } = require("../addUibook");
/* config-overrides.js */

module.exports = function override(config, env) {
  // optional
  // add this plugin to get automatic docs for component
  config = addBabelPlugin([
    "babel-plugin-react-docgen",
    {
      removeMethods: true, // optional (default: false)
      "handlers:": ["defaultPropsHandler"] // optional array of custom handlers (use the string name of the package in the array)
    }
  ])(config);
  // required
  config = addUiBook({
    setupFilePath: resolve(__dirname, "./src/setupUiBook.js")
  })(config);
  return config;
};
