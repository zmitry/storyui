import { css } from "emotion";
import React, { useEffect, useState } from "react";
import ErrorBoundary from "react-error-boundary";
import { EditIcon, Frame, HStack, IconButton, link, OpenLinkIcon, Stack } from "./components";
import { Card } from "./components/Card";
import { omit } from "./helpers";
import { useProps } from "./useProps";

const classes = {
  header: css`
    display: flex;
    align-items: center;
  `
};

export function Page({ Value, title, framed }) {
  // const [targetRef, isInViewport] = useIsInViewport(20);
  const { props, propsEditor } = useProps(Value);
  const [propsExpanded, setExpanded] = useState(false);
  const [hasError, setError] = useState(false);
  return (
    <Card
      title={
        <div className={classes.header}>
          <h4 style={{ margin: 0 }}>{title}</h4>
          <HStack gap={5} style={{ marginLeft: "auto" }}>
            {props && (
              <IconButton
                aria-label="Show props"
                data-balloon-pos="down"
                selected={propsExpanded}
                onClick={() => setExpanded(s => !s)}
              >
                <EditIcon />
              </IconButton>
            )}
            <a
              target="_blank"
              href={
                "#" +
                link({
                  page: title,
                  iframe: "single"
                })
              }
            >
              <IconButton aria-label="Open in separate window" data-balloon-pos="down">
                <OpenLinkIcon />
              </IconButton>
            </a>
          </HStack>
        </div>
      }
    >
      <Stack gap={15}>
        <div
          style={{
            background: "white",
            padding: 10,
            position: "relative",
            maxHeight: "calc(100vh - 250px)",
            overflow: "auto"
          }}
        >
          <ErrorBoundary
            key={hasError ? JSON.stringify(props) : "error"}
            FallbackComponent={() => {
              useEffect(() => {
                return () => setError(false);
              }, []);
              return null;
            }}
            onError={err => {
              console.log(err);
              setError(true);
              return "err";
            }}
          >
            {framed ? (
              <Frame>
                <Value {...props} />
              </Frame>
            ) : (
              <Value {...props} />
            )}
          </ErrorBoundary>
        </div>
      </Stack>
      {propsExpanded ? propsEditor : null}
    </Card>
  );
}

function GetCases(imports) {
  return Object.entries(imports).map(([key, Value]) => ({
    name: key,
    Component: Value
  }));
}

export function buildPages(modules) {
  const pages = Object.entries(modules).reduce((acc, [name, el]: any) => {
    const config = el.default || {};
    const stories = el.default?.stories ? el.default?.stories : omit(el, "default");
    const res = {
      name: name,
      nest: config.nest,
      component: el.default?.component,
      framed: config.framed,
      config: config,
      cases: GetCases(stories)
    };
    acc.push(res);
    return acc;
  }, []);
  return pages;
}
