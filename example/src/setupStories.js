import importAll from "import-all.macro";
import { start, buildPages } from "storyui";
import "./index.css";

if (window.location.pathname.startsWith("/storyui.html")) {
  async function setup() {
    const pages = await importAll("./**/*.story.*");
    start({
      pages: buildPages(pages)
    });
  }
  setup();
}
