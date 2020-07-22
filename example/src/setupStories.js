import "uiplaybook/src/reset.css";
import "uiplaybook/src/styles.css";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { getApp, isStory } from "uiplaybook";

const AppWrapper = (children) => {
  return <Suspense fallback={"Loading ..."}>{children}</Suspense>;
};

function parseDefaults(m, stories, parentKey) {
  const config = {
    ...m.default,
    decorator: [AppWrapper, ...(m.default?.decorators || [])].reduce(
      (acc, el) => (ch) => el(acc(ch)),
      (d) => d
    ),
  };
  const storiesMapForFile = {
    ...m,
    ...m.default?.stories,
  };
  for (let key in storiesMapForFile) {
    if (isStory(key)) {
      let story = storiesMapForFile[key];
      story.config = config;
      stories.set(parentKey + "/" + key, story);
    }
  }
  return stories;
}

const req = require.context(".", true, /\.story\.*$/);

function render() {
  let stories = new Map();

  for (let key of req.keys()) {
    parseDefaults(req(key), stories, key);
  }
  ReactDOM.render(
    getApp({
      stories,
    }),
    document.getElementById("root")
  );
}

render();
