import { start, buildPages } from "@uibook/core";
import "@uibook/core/styles.css";
import "./index.css";

const req = require.context(".", true, /\.story\.*$/);

const config = {
  wrapper: children => children,
  pages: buildPages(req)
};

if (window.location.pathname.startsWith("/uibook")) {
  start(config);
}
