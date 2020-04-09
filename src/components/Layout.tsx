import React from "react";

export function Stack({ children, gap, inner, style, content = "start", ...props }: any) {
  return (
    <div
      {...props}
      style={{
        ...style,
        display: "grid",
        gridRowGap: gap + "px",
        gridAutoFlow: "row",
        alignContent: content,
        padding: inner
      }}
    >
      {children}
    </div>
  );
}

export function HStack({ children, gap, content = "start", align = "center", style = null }) {
  return (
    <div
      style={{
        display: "grid",
        gridAutoFlow: "column",
        columnGap: gap + "px",
        justifyContent: content,
        alignItems: align,
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function PageLayout({ children }) {
  return (
    <div
      style={{
        display: "grid",
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        grid: `
    "side content sidebar" 1fr
    / min-content 1fr max-content
  `
      }}
    >
      {children}
    </div>
  );
}
