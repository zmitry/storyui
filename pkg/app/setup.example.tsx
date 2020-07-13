import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "setupStore";
import { StylesWrapper } from "StylesWrapper";
import { ReactQueryConfigProvider } from "react-query";
import { getApp, isStory } from "libs/storyui";
import { shortUrl } from "libs/storyui/shorturl";

const AppWrapper = (children) => {
  return (
    <Suspense fallback={"Loading ..."}>
      <Provider store={store}>
        <ReactQueryConfigProvider config={{ refetchAllOnWindowFocus: false }}>
          <StylesWrapper>{children}</StylesWrapper>
        </ReactQueryConfigProvider>
      </Provider>
    </Suspense>
  );
};

function parseDefaults(m, stories, parentKey) {
  const config = {
    ...m.default,
    decorators: [AppWrapper].concat(m.default?.decorators).filter(Boolean),
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

function loadStories(req) {
  let m = new Map();
  for (let key of req.keys()) {
    parseDefaults(req(key), m, key);
  }
  return m;
}

const req = (require as any).context(".", true, /\.story\.*$/);
const stories = loadStories(req);

function render() {
  const root = document.getElementById("root");
  ReactDOM.render(
    getApp({
      stories,
      ...shortUrl,
    }),
    root
  );
}

render();
