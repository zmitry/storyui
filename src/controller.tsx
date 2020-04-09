import React, { useState } from "react";
import { useQueryState } from "use-location-state";
import { PageLayout, Stack } from "./components/Layout";
import { SidePanel } from "./components/Sidepanel";
import { GenerateHtml } from "./genMarkdown";
import { Toolbar } from "./components/Toolbar";
import { docsUi, FigmaIcon, IconButton, DocsIcon } from "./components";
import { Page } from "./Page";
import { basename } from "path";

function useData({ pages }) {
  const pagesArray = [];
  const linksObj = {};
  for (const page of pages) {
    if (page.config?.nest) {
      linksObj[page.name] = {
        title: basename(page.name),
        items: [],
      };
      for (const pageCase of page.cases) {
        pagesArray.push({ ...pageCase, nest: true });
        linksObj[page.name].items.push({
          title: pageCase.name,
          key: pageCase.name,
          link: "#page=" + pageCase.name,
        });
      }
    } else {
      pagesArray.push(page);
      linksObj[page.name] = {
        title: basename(page.name),
        key: page.name,
        link: "#page=" + page.name,
      };
    }
  }
  const links = Object.values(linksObj);
  return {
    links,
    pagesArray,
  };
}

function Content({ page, name, isEditable, framed }) {
  if (page.nest) {
    if (framed) {
      const V = page.Component;
      return <V />;
    }
    return (
      <div key={name} contentEditable={isEditable}>
        <Page Value={page.Component} title={page.name} />
      </div>
    );
  }
  const content = page.cases.map((storyCase, index) => {
    const key = name + index;
    if (framed) {
      const V = page.Component;
      return <V key={key} />;
    }
    console.log("storyCase: ", storyCase);
    return (
      <div key={key} contentEditable={isEditable}>
        <Page Value={storyCase.Component} title={storyCase.name} />
      </div>
    );
  });
  return content;
}

function IFrame({ page, isEditable }) {
  const [height, setHeight] = useState(500);
  return (
    <iframe
      style={{
        height: "100%" || height,
        width: "100%",
      }}
      onLoad={(e) => {
        const main = (e.target as HTMLIFrameElement).contentDocument.querySelector(
          "body"
        );
        setHeight(main.offsetHeight);
      }}
      frameBorder="none"
      src={
        "/uibook#" +
        new URLSearchParams({
          page,
          isEditable: String(isEditable),
          iframe: "on",
        }).toString()
      }
    ></iframe>
  );
}

const DefaultLayout = ({ children }) => {
  return (
    <Stack className="uibook-container " inner="10px 0" gap={10}>
      {children}
    </Stack>
  );
};

export default function UibookController(props) {
  const { links, pagesArray } = useData(props);
  console.log("pagesArray: ", pagesArray);

  const Layout = props.layout || DefaultLayout;
  const [page, setPage] = useQueryState("page", pagesArray[0].name);

  const isEditable = false;
  const [iframe] = useQueryState("iframe", "off");

  // const [{ page, isEditable, iframe }, setUrlState] = useUrlState({
  //   page: pagesArray[0].key,
  //   isEditable: false,
  //   iframe: "off"
  // });

  const pageData =
    pagesArray
      .map((el) => (el.cases ? [el.cases, el] : el))
      .flat(2)
      .find((el) => el.name === page) || pagesArray[0];

  const Wrapper = props.wrapper;

  const Cmp = Wrapper(
    <Content
      framed={pageData.framed}
      name={pageData.name}
      page={pageData}
      isEditable={isEditable}
    />
  );
  if (iframe === "on") {
    return Cmp;
  } else if (iframe === "single") {
    const V = pageData.Component;
    return Wrapper(<V />);
  }
  const [tab, setTab] = useState("none");
  const component = pageData.component?.__docgenInfo;
  const showDesign = !!component;
  const showDocs = !!component;

  return (
    <PageLayout>
      <Toolbar
        key={pageData.name}
        designTab={
          showDesign &&
          tab === "design" && (
            <iframe
              frameBorder="0"
              width="100%"
              height="100%"
              src={pageData.config.figma}
            />
          )
        }
        docsTab={
          showDocs &&
          tab === "docs" && (
            <div
              className={docsUi}
              dangerouslySetInnerHTML={{
                __html: GenerateHtml(component),
              }}
            />
          )
        }
      />
      <SidePanel
        selected={page}
        onClick={(d) => {
          setPage((d as any).key, { method: "push" });
        }}
        tree={links as any}
      />
      <div
        className="uibook-page"
        style={{
          gridArea: "content",
          overflow: "auto",
          background: "rgb(221, 221, 221)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 5,
            top: 5,
          }}
        >
          <Stack gap={5}>
            {showDesign && (
              <IconButton
                aria-label="Show design"
                data-balloon-pos="left"
                selected={tab === "design"}
                onClick={() =>
                  setTab((s) => (s === "design" ? "none" : "design"))
                }
              >
                <FigmaIcon />
              </IconButton>
            )}
            {showDocs && (
              <IconButton
                aria-label="Show docs"
                data-balloon-pos="left"
                selected={tab === "docs"}
                onClick={() => setTab((s) => (s === "docs" ? "none" : "docs"))}
              >
                <DocsIcon />
              </IconButton>
            )}
          </Stack>
        </div>
        {pageData.iframe ? (
          <IFrame page={page} isEditable={isEditable}></IFrame>
        ) : (
          <Layout>
            <h1>{basename(pageData.name)}</h1>
            {Cmp}
          </Layout>
        )}
      </div>
    </PageLayout>
  );
}
