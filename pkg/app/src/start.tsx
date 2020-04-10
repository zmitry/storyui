import ReactDOM from "react-dom";
import React from "react";
import UibookController from "./controller";
import { setupStyles } from "./theme";

const defaults = {
  wrapper: children => children
};

type Config = {
  layout?: React.FunctionComponent;
  wrapper: React.FunctionComponent;
  pages: any;
};
export function start(config: Config) {
  window.onload = function() {
    Object.assign(config, defaults);
    setupStyles();
    var tag = document.getElementById("uibook-root");
    ReactDOM.render(
      <UibookController wrapper={config.wrapper} layout={config.layout} pages={config.pages} />,
      tag
    );
  };
}
