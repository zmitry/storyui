let res;
if (process.env.REACT_APP_STORY) {
  res = import("./setupStories");
} else {
  res = import("./setupApp");
}
