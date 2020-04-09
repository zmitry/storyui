import React from "react";
import App, { Header } from "./App";

export default {
  nest: true
};

export function AppStory() {
  return <App />;
}

export function AppHeaderStory({ children = "demo children" }) {
  return <Header children={children} />;
}
