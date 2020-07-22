import React from "react";
import App from "./App";

export function AppStory({ title }: any) {
  return <App title={title} />;
}

AppStory.args = {
  title: "hello",
};
