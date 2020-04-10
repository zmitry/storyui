import React, { useState } from "react";
import App, { Header } from "./App";

export default {
  // it means show each story as separate option
  nest: true
};

export function AppStory() {
  const [state, setState] = useState("hello");
  console.log("setState: ", setState);
  console.log("state: ", state);
  return <App />;
}

export function AppHeaderStory({ children = "demo children" }) {
  return <Header children={children} />;
}
