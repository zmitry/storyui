import React from "react";
import { SidePanel } from "./Sidepanel";

const data = [
  { title: "hello", link: "asf" },
  {
    title: "hello",
    tag: "design",
    items: [
      { title: "hello1", link: "asf" },
      { title: "hello2", link: "asf" },
      {
        title: "nested",
        items: [
          { title: "hello", link: "asf" },
          { title: "hello", link: "asf" },
          { title: "hello", link: "asf" },
        ],
      },
    ],
  },
];

export function SidePanelStory() {
  return (
    <SidePanel selected="qw" tree={data as any} defaultTag={"components"} />
  );
}
