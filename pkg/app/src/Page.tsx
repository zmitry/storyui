import { css } from "emotion";
import React, { useEffect, useState } from "react";
import ErrorBoundary from "react-error-boundary";
import {
  EditIcon,
  Frame,
  HStack,
  IconButton,
  link,
  OpenLinkIcon,
  Stack,
  Element,
} from "./components";
import { Card } from "./components/Card";
import { useProps } from "./useProps";

const classes = {
  header: css`
    display: flex;
    align-items: center;
  `,
};

function ElementContainerTemplate({ children }) {
  const [hasError, setError] = useState(false);

  return (
    <Stack gap={15}>
      <div
        style={{
          background: "white",
          padding: 10,
          position: "relative",
          maxHeight: "calc(100vh - 250px)",
          overflow: "auto",
        }}
      >
        <ErrorBoundary
          key={hasError ? Math.random() : "error"}
          FallbackComponent={() => {
            useEffect(() => {
              return () => setError(false);
            }, []);
            return null;
          }}
          onError={(err) => {
            console.log(err);
            setError(true);
            return "err";
          }}
        >
          {children}
        </ErrorBoundary>
      </div>
    </Stack>
  );
}

export function Page({ Value, title, framed, page }) {
  // const [targetRef, isInViewport] = useIsInViewport(20);
  const { props, propsEditor } = useProps(Value);
  const [propsExpanded, setExpanded] = useState(false);
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
                onClick={() => setExpanded((s) => !s)}
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
                  iframe: "single",
                })
              }
            >
              <IconButton
                aria-label="Open in separate window"
                data-balloon-pos="down"
              >
                <OpenLinkIcon />
              </IconButton>
            </a>
          </HStack>
        </div>
      }
    >
      <ElementContainerTemplate>
        {framed ? (
          <Frame>
            <Element page={page} props={props} />
          </Frame>
        ) : (
          <Element page={page} props={props} />
        )}
      </ElementContainerTemplate>
      {propsExpanded ? propsEditor : null}
    </Card>
  );
}
