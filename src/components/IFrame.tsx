import React, { useState } from "react";

export function link(obj: Record<string, any>) {
  return new URLSearchParams(obj).toString();
}

export function IFrame({ page, prefix = "/storyui.html#" }) {
  const [height, setHeight] = useState(500);
  return (
    <iframe
      title={page}
      style={{
        height: "100%" || height,
        width: "100%",
        minHeight: 300,
        minWidth: 300
      }}
      onLoad={e => {
        const main = (e.target as HTMLIFrameElement).contentDocument.querySelector("body");
        setHeight(main.offsetHeight);
      }}
      frameBorder="none"
      src={
        prefix +
        link({
          page,
          iframe: "single"
        })
      }
    ></iframe>
  );
}
