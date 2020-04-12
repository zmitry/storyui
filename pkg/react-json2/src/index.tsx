import importAll from "import-all.macro";
import { start, buildPages } from "storyui";
import "./index.css";
if (window.location.pathname.startsWith("/storyui.html")) {
  async function setup() {
    // you can pass wrapper as param
    // wrapper: (children)=><ThemeContext children={children} />
    //   const pagesReact = buildPages(await importAll("./**/*.story.*"), reactRenderer({ wrapper: children=><Theme children={children} /> }));
    const pagesReact = buildPages(await importAll("./**/*.story.*"));

    start({
      pages: pagesReact
    } as any);
  }
  setup();
}
