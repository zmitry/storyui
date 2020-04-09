import ReactDOM from "react-dom";
import React from "react";
import UibookController from "./controller";

export function start(config) {
  window.onload = function() {
    var tag = document.getElementById("uibook-root");
    ReactDOM.render(
      <UibookController wrapper={config.wrapper} layout={config.layout} pages={config.pages} />,
      tag
    );
  };
}
