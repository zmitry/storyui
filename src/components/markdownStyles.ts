import { css } from "emotion";
export const docsUi = css`
  padding: 0px 20px;
  table {
    border-collapse: collapse;
    border-spacing: 0;
    color: #333333;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    width: 100%;
    margin-top: 25px;
    margin-bottom: 40px;
    margin-left: 1px;
    margin-right: 1px;
  }
  td,
  th {
    padding: 20px;
  }
  td:first-of-type {
    width: 20%;
  }
  td {
    padding-top: 16px;
    padding-bottom: 16px;
  }
  th {
    padding-top: 14px;
    padding-bottom: 14px;
  }

  td:last-of-type {
    padding-right: 20px;
  }

  thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }

  tbody {
    background: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 1px, rgba(0, 0, 0, 0.065) 0 0 0 1px;
    border-radius: 4px;
  }
`;
