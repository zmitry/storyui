import "./reset.css";
import "./styles.css";
import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { useSubscription } from "use-subscription";
import { last } from "lodash";
import { stringify, parse } from "./url";
import { useArgs } from "./useArgs";
import { Trie, dfs } from "./trie";

//#region uri helpers
function pushLocationEvent(data) {
  window.dispatchEvent(new CustomEvent("locationchange", { detail: data }));
}
function polyfillEvent() {
  window.addEventListener("popstate", () => pushLocationEvent({}));
}
function parseQueryHash(hash) {
  return parse(hash.slice(1));
}
function stringifyQueryHash(hash) {
  return "?" + stringify(hash);
}
function subscribeToLocationChange(w, fn) {
  w.addEventListener("locationchange", fn);
  return () => {
    w.removeEventListener("locationchange", fn);
  };
}
function navigate(params, { replace = false, preserveParams = true } = {}) {
  const prevParams = preserveParams
    ? parseQueryHash(window.location.search)
    : {};
  document.title = params.story;
  if (replace) {
    window.history.replaceState(
      "",
      document.title,
      stringifyQueryHash({ ...prevParams, ...params })
    );
  } else {
    window.history.pushState(
      "",
      document.title,
      stringifyQueryHash({ ...prevParams, ...params })
    );
  }
  pushLocationEvent({ replace: replace, preserveParams });
}

function useHash() {
  const subscription = useMemo(
    () => ({
      getCurrentValue: () => window.location.search,
      subscribe: (callback) => {
        return subscribeToLocationChange(window, callback);
      },
    }),
    []
  );
  const value = useSubscription(subscription);
  return parseQueryHash(value);
}
function isUpperCase(str) {
  return str[0] === str[0].toUpperCase();
}
//#endregion

//#region iframe controller

function StoryCase({
  componentName,
  component,
  config,
  stringifyProps,
  parseProps,
}) {
  const params = useHash();
  const id = params.story + componentName;

  const { component: c, input, values, fieldMapping } = useArgs({
    Component: component,
    fieldMapping: params.fieldMapping,
    event: console.log,
    values: params.props,
    parseProps,
  });
  const wrapper = config.decorators.reduce((acc, el) => (ch) => el(acc(ch)));
  const getFullscreenLink = async (addProps) => {
    const stringifiedProps = addProps ? await stringifyProps(values) : null;
    return (
      window.location.origin +
      stringifyQueryHash({
        ...params,
        fullscreen: true,
        fieldMapping,
        story: params.story,
        props: stringifiedProps,
      })
    );
  };
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <div
        className="card-title hstack"
        style={
          {
            "--space": "0.5ch",
          } as any
        }
      >
        <div>{componentName}</div>
        <a
          title="fullscreen"
          className="size1 icon-button"
          onClick={async (e) => {
            e.preventDefault();
            const url = await getFullscreenLink(false);
            window.open(url);
          }}
          target="_blank"
        >
          ⧉
        </a>
        {config.figma && (
          <a
            title="design"
            className={
              "size1 icon-button " +
              (params.sidepanelActive === id ? "active" : "")
            }
            onClick={(e) => {
              navigate({
                sidepanelActive: params.sidepanelActive === id ? null : id,
              });
            }}
          >
            ᚧ
          </a>
        )}
        <a
          title="props"
          className={
            "size1 icon-button " + (params.activeInput === id ? "active" : "")
          }
          onClick={async (e) => {
            if (e.shiftKey) {
              const url = await getFullscreenLink(!!e.shiftKey);
              navigator.clipboard.writeText(url);
            } else {
              navigate({ activeInput: params.activeInput === id ? null : id });
            }
          }}
        >
          ✎
        </a>
      </div>
      <div className="hstack toolbar-panel">
        {params.sidepanelActive === id && (
          <iframe
            className="tab"
            title="figma"
            src={config.figma}
            height="500"
          />
        )}
        {params.activeInput === id && (
          <div className="tab props-editor">{input}</div>
        )}
      </div>
      {wrapper(c)}
    </div>
  );
}
function IframeController({ items, encodeKey, decodeKey }) {
  return (
    <div className="stack">
      <Suspense
        fallback={<div style={{ margin: "auto" }} className="storyui-loader" />}
      >
        {items.map(([key, C]: any) => {
          return (
            <StoryCase
              key={key}
              stringifyProps={encodeKey}
              parseProps={decodeKey}
              config={C.config}
              componentName={last(key.split("/"))}
              component={C}
            />
          );
        })}
      </Suspense>
    </div>
  );
}
//#endregion

//#region controller app

const SidePanel = React.memo(function SidePanel({ stories }: any) {
  let res = [];
  const params = useHash();
  dfs(stories, (node, depth, parentKey) => {
    // do not render top level folder which is ".""
    if (!parentKey) {
      return;
    }
    let key = node.key;
    const label = key.replace(parentKey, "").replace("/", "");
    let className = params.story === key ? "selected" : "";
    if (node.end) {
      className += " side-label-item";
    } else {
      className += " side-label-group";
    }
    res.push(
      <a
        style={{
          marginLeft: depth - 1 + "ch",
        }}
        title={label}
        className={className}
        key={key + "group"}
        onClick={(e) => {
          e.preventDefault();
          navigate({ story: key }, { preserveParams: false });
          return false;
        }}
      >
        {label}
      </a>
    );
  });

  return (
    <div style={{ overflow: "auto" }}>
      <nav className="side stack" style={{ "--space": "2px" } as any}>
        {res}
      </nav>
    </div>
  );
});

function AppIframe() {
  const ref = useRef<any>(null);
  const params = useHash();
  const story = params.story;
  useEffect(() => {
    const w = ref.current?.contentWindow;
    if (w) {
      return subscribeToLocationChange(w, () => {
        const { iframe, ...params } = parseQueryHash(w.location.search);
        navigate(params, { replace: true });
      });
    }
  }, [ref, story]);
  const cmp = useMemo(() => {
    const url = stringifyQueryHash({ ...params, iframe: true });
    return (
      <object
        aria-label="story"
        ref={ref}
        key={story}
        className="embed"
        data={url}
      />
    );
  }, [story]);
  return cmp;
}

function App({ stories }) {
  return (
    <div className="storyRoot">
      <SidePanel stories={stories} />
      <AppIframe />
    </div>
  );
}
//#endregion
export function isStory(key) {
  return isUpperCase(key);
}
export function getApp({ stories, encodeKey, decodeKey }) {
  polyfillEvent();

  const { story, iframe } = parse<{
    story: string;
    iframe?: any;
  }>(window.location.search);
  const root = new Trie(stories);
  if (iframe) {
    let items = root.find(story)?.map((el) => [el.key, el.value]);
    return (
      <IframeController
        encodeKey={encodeKey}
        decodeKey={decodeKey}
        items={items || []}
      />
    );
  }
  return <App stories={root} />;
}
