import React, { useRef, useEffect, useMemo, Suspense } from "react";
import { useSubscription } from "use-subscription";
import { last } from "lodash";
import { stringify, parse } from "./url";
import { useArgs } from "./useArgs";
import { Trie, dfs } from "./trie";
import { shortUrl } from "./shorturl";

//#region uri helpers
function pushLocationEvent(data) {
  window.dispatchEvent(new CustomEvent("locationchange", { detail: data }));
}
function parseQueryHash(hash) {
  return parse(hash.slice(1));
}
function stringifyQueryHash(hash) {
  return "?" + stringify(hash);
}
function subscribeToLocationChange(w: Window, fn) {
  w.addEventListener("locationchange", fn);
  return () => w.removeEventListener("locationchange", fn);
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
      subscribe: (callback) => subscribeToLocationChange(window, callback),
    }),
    []
  );
  return parseQueryHash(useSubscription(subscription));
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
        {params.activeInput === id && (
          <div className="tab props-editor">{input}</div>
        )}
      </div>
      {config.decorator(c)}
    </div>
  );
}
function IframeController({
  items,
  encodeKey = shortUrl.decodeKey,
  decodeKey = shortUrl.encodeKey,
}) {
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

const SidePanel = React.memo(function SidePanel({ stories, story }: any) {
  let res = [];
  dfs(stories, (node, depth, parentKey) => {
    // do not render top level folder which is ".""
    if (!parentKey) {
      return;
    }
    let key = node.key;
    const label = key.replace(parentKey, "").replace("/", "");
    let className = story === key ? "selected" : "";
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

function AppIframe({ ...params }) {
  const ref = useRef<any>(null);
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
  const params = useHash();

  return (
    <div className="storyRoot">
      <SidePanel stories={stories} {...params} />
      <AppIframe {...params} />
    </div>
  );
}
//#endregion
export function isStory(key) {
  return isUpperCase(key);
}
export function getApp({ stories, encodeKey, decodeKey }) {
  window.addEventListener("popstate", () => pushLocationEvent({}));

  const { story, iframe } = parse<{
    story: string;
    iframe?: any;
  }>(window.location.search);
  const root = new Trie(stories);

  if (iframe) {
    let items = root.find(story || "")?.map((el) => [el.key, el.value]);
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
