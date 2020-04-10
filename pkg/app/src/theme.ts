import { injectGlobal } from "emotion";

export const theme = {
  textPrimary: "rgb(40, 40, 40)",
  textSecondary: "rgb(50, 50, 50)",
  iconPrimary: "rgb(128, 128, 128)",
  backgroundPrimary: "rgba(240, 240, 240, 1)",
  divider: "rgba(255, 255, 255, 0.1)",
  dividerInverted: "rgba(0, 0, 0, 0.1)",
  font: `"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco",
  BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;`
};

export function setupStyles() {
  injectGlobal`
  * {
  box-sizing: border-box;
}
.uibook-loader__position {
  height: 50px;
}

html,
body {
  font-family: "Roboto", sans-serif;
  padding: 0;
  margin: 0;
  height: 100%;
}

#uibook-root {
  height: 100%;
}

:root {
  --background-hover: rgb(240, 240, 240);
  --shadow1: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
}

  `;
}
