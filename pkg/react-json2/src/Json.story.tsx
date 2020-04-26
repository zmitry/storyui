import React from "react";
import { Json } from "./Json";
import JSONTree from "react-json-tree";

export function JSONTSTORY() {
  // Inside a React component:
  const json = {
    array: [1, 2, 3],
    bool: true,
    object: {
      foo: "bar",
    },
  };

  return <JSONTree data={json} />;
}
export function JSONStory() {
  return <Json value={{}} />;
}

export function JSONStory2() {
  return (
    <Json
      value={{
        name: "storyui",
        version: "1.1.4",
        main: "dist/storyui.esm.js",
        types: "./dist/index.d.ts",
        author: "dmitry",
        license: "MIT",
        dependencies: {
          "@types/lodash": "^4.14.149",
          "@types/react": "^16.9.33",
          "@types/react-dom": "^16.9.6",
          "@types/react-textarea-autosize": "^4.3.5",
          "import-all.macro": "*",
          marked: "^0.8.2",
          "react-error-boundary": "^1.2.5",
          "react-textarea-autosize": "^7.1.2",
          "use-location-state": "^2.3.1",
        },
        devDependencies: {
          emotion: "9.2.4",
          lodash: "^4.17.15",
          "lodash-es": "^4.17.15",
          tsdx: "^0.13.1",
        },
        peerDependencies: {
          "babel-plugin-react-docgen": "*",
          emotion: "9.2.4",
          "html-webpack-plugin": "*",
          "import-all.macro": "*",
          lodash: "^4.17.15",
          "lodash-es": "^4.17.15",
          react: "*",
          "react-dom": "*",
        },
        scripts: {
          build: "tsdx build",
          watch: "tsdx watch",
        },
      }}
    />
  );
}

export function JSONStory3() {
  return <Json value={require("./test.json")} />;
}
