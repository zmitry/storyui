import importAll from "import-all.macro";
import { start, buildPages } from "storyui";
import "./index.css";

if (window.location.pathname.startsWith("/storyui.html")) {
  async function setup() {
    const pagesReact = buildPages(await importAll("./**/*.story.*"));
    const pagesHtml = buildPages(
      await importAll("./**/*.htmlstory.*"),
      (Component, target) => {
        target.innerHTML = Component();
      }
    );

    start({
      // you can pass wrapper as param
      // wrapper: (children)=><ThemeContext children={children} />
      pages: pagesReact.concat(pagesHtml)
    });
  }
  setup();
}
