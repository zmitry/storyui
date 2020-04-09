import React from "react";
import { useQueryState } from "use-location-state";
import { basename } from "path";
import { css } from "emotion";
import { GenerateHtml } from "./genMarkdown";
import { docsUi, Stack, SidePanel, IFrame } from "./components";
import { Page } from "./Page";
import { ControllerTemplate } from "./ControllerTemplate";

function useData({ pages }) {
  const pagesArray = [];
  const linksObj = {};
  for (const page of pages) {
    if (page.config?.nest) {
      linksObj[page.name] = {
        title: basename(page.name).replace(/\.story(.*)$/gi, ""),
        items: []
      };
      for (const pageCase of page.cases) {
        pagesArray.push({ ...pageCase, nest: true });
        linksObj[page.name].items.push({
          title: pageCase.name,
          key: pageCase.name,
          link: "#page=" + pageCase.name
        });
      }
    } else {
      pagesArray.push(page);
      linksObj[page.name] = {
        title: basename(page.name).replace(/\.story(.*)$/gi, ""),
        key: page.name,
        link: "#page=" + page.name
      };
    }
  }
  const links = Object.values(linksObj);
  return {
    links,
    pagesArray
  };
}

function Content({ page, name, isEditable, framed }) {
  if (page.nest) {
    return (
      <div key={name} contentEditable={isEditable}>
        <Page framed={framed} Value={page.Component} title={page.name} />
      </div>
    );
  }
  const content = page.cases.map((storyCase, index) => {
    const key = name + index;
    return (
      <div key={key} contentEditable={isEditable}>
        <Page framed={framed} Value={storyCase.Component} title={storyCase.name} />
      </div>
    );
  });
  return content;
}

const classes = {
  container: css`
    margin: auto;
    @media only screen and (min-width: 1300px) {
      max-width: 83%;
    }
  `
};
const DefaultLayout = ({ children }) => {
  return (
    <Stack className={classes.container} inner="10px 0" gap={10}>
      {children}
    </Stack>
  );
};

export default function StoryController(props) {
  const { links, pagesArray } = useData(props);

  const Layout = props.layout || DefaultLayout;
  const [page, setPage] = useQueryState("page", pagesArray[0].name);

  const isEditable = false;
  const [iframe] = useQueryState("iframe", "off");
  const pageData =
    pagesArray

      .map(el => (el.cases ? [el.cases, el] : el))
      .flat(2)
      .find(el => el.name === page) || pagesArray[0];
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
  const component = pageData.component?.__docgenInfo;
  const showDesign = !!component;
  const showDocs = !!component;

  return (
    <ControllerTemplate
      showDesign={showDesign}
      layoutChildren={
        <SidePanel
          selected={page}
          onClick={d => {
            setPage((d as any).key, { method: "push" });
          }}
          tree={links as any}
        />
      }
      showDocs={showDocs}
      designTab={
        showDesign && (
          <iframe
            title={page}
            frameBorder="0"
            width="100%"
            height="100%"
            src={pageData.config?.figma}
          />
        )
      }
      docsTab={
        component &&
        showDocs && (
          <div
            className={docsUi}
            dangerouslySetInnerHTML={{
              __html: GenerateHtml(component)
            }}
          />
        )
      }
    >
      {pageData.iframe ? (
        <IFrame page={page}></IFrame>
      ) : (
        <Layout>
          <h1>{basename(pageData.name)}</h1>
          {Cmp}
        </Layout>
      )}
    </ControllerTemplate>
  );
}
