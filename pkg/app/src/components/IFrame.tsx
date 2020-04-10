import React, { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useCallback } from "react";

export function link(obj: Record<string, any>) {
  return new URLSearchParams(obj).toString();
}

export function Frame({ children, prefix = "/storyui.html#" }) {
  const ref = useRef<HTMLDocument>(null);
  const [loading, setLoading] = useState(true);

  const target = !loading
    ? ref.current.body.querySelector("#uibook-root")
    : null;

  const onLoad = useCallback(e => {
    (e.target as HTMLIFrameElement).contentDocument.querySelector("body");
    ref.current = (e.target as HTMLIFrameElement).contentDocument;
    setTimeout(() => {
      setLoading(false);
    });
  }, []);
  return (
    <>
      <iframe
        style={{
          height: target?.getBoundingClientRect().height || "100%",
          width: "100%",
          minHeight: 300,
          minWidth: 300
        }}
        frameBorder="none"
        title="iframe"
        src={prefix + link({ iframe: "single" })}
        onLoad={onLoad}
      >
        {!loading && createPortal(children, target)}
      </iframe>
    </>
  );
}

export function Element({ props, page }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      page.render(page.Component, ref.current, props, page);
    }
  }, [props, page]);
  return <div ref={ref} />;
}

// export function IFrame({ page, prefix = "/storyui.html#" }) {
//   const [height, setHeight] = useState(500);
//   return (
//     <iframe
//       title={page}
//       style={{
//         height: "100%" || height,
//         width: "100%",
//         minHeight: 300,
//         minWidth: 300
//       }}
//       onLoad={e => {
//         const main = (e.target as HTMLIFrameElement).contentDocument.querySelector("body");
//         setHeight(main.offsetHeight);
//       }}
//       frameBorder="none"
//       src={
//         prefix +
//         link({
//           page,
//           iframe: "single"
//         })
//       }
//     ></iframe>
//   );
// }
