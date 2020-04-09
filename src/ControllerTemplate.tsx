import React, { useState } from "react";
import { css } from "emotion";
import { theme } from "./theme";
import { DocsIcon, FigmaIcon, IconButton } from "./components";
import { PageLayout, Stack } from "./components/Layout";

const classes = {
  page: css`
    padding: 15px;
    transition: background 300ms;
    min-height: 100%;
    font-family: ${theme.font};
  `
};

export function ControllerTemplate({
  designTab,
  docsTab,
  showDesign,
  showDocs,
  children,
  layoutChildren
}) {
  const [tab, setTab] = useState("none");

  return (
    <PageLayout>
      <div
        style={{
          gridArea: "sidebar",
          minWidth: tab !== "none" ? "500px" : "0"
        }}
      >
        {designTab && tab === "design" && designTab}
        {docsTab && tab === "docs" && docsTab}
      </div>
      {layoutChildren}

      <div
        className={classes.page}
        style={{
          gridArea: "content",
          overflow: "auto",
          background: "rgb(221, 221, 221)",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 5,
            top: 5
          }}
        >
          <Stack gap={5}>
            {showDesign && (
              <IconButton
                aria-label="Show design"
                data-balloon-pos="left"
                selected={tab === "design"}
                onClick={() => setTab(s => (s === "design" ? "none" : "design"))}
              >
                <FigmaIcon />
              </IconButton>
            )}
            {showDocs && (
              <IconButton
                aria-label="Show docs"
                data-balloon-pos="left"
                selected={tab === "docs"}
                onClick={() => setTab(s => (s === "docs" ? "none" : "docs"))}
              >
                <DocsIcon />
              </IconButton>
            )}
          </Stack>
        </div>
        {children}
      </div>
    </PageLayout>
  );
}
