import React from "react";

export function Toolbar({ designTab, docsTab }) {
  return (
    <div
      style={{
        gridArea: "sidebar",
        minWidth: designTab || docsTab ? "500px" : "0",
      }}
    >
      {designTab && designTab}
      {docsTab && docsTab}
    </div>
  );
}
