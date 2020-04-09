import React from "react";
import { css, cx } from "emotion";

const classes = {
  root: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 32px;
    color: hsl(0, 0%, 30%);
    white-space: nowrap;
    user-select: none;
    padding: 0px 8px;
    border-width: 0px;
    border-style: initial;
    border-color: initial;
    border-image: initial;
    border-radius: 3px;
    outline: none;
    transition: background 0.32s ease 0s, color 0.32s ease 0s, opacity 0.32s ease 0s;
    :hover {
      background: hsl(0, 0%, 80%);
    }
  `,
  selected: css`
    background: hsl(0, 0%, 95%);
    color: #009aff;
  `
};

function Icon(content, props: any) {
  return (
    <svg
      {...props}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {content}
    </svg>
  );
}
export const ExpandIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 2 20 20"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

export const FolderIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>,
    props
  );
};

export const BurgerIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </>,
    props
  );
};
export const DocsIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </>,
    props
  );
};

export const FigmaIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <>
      <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path>
      <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path>
      <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z"></path>
      <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path>
      <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path>
    </>,
    props
  );
};

export const EditIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </>,
    props
  );
};

export const OpenLinkIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) => {
  return Icon(
    <>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
      <polyline points="15 3 21 3 21 9"></polyline>
      <line x1="10" y1="14" x2="21" y2="3"></line>
    </>,
    props
  );
};

export const CodeIcon = (props: React.HtmlHTMLAttributes<SVGSVGElement>) =>
  Icon(
    <>
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </>,
    props
  );
export const IconButton = ({
  children,
  ...props
}: { children: React.ReactNode; selected?: boolean } & React.HtmlHTMLAttributes<
  HTMLDivElement
>) => {
  return (
    <div
      {...props}
      className={cx(classes.root, {
        [classes.selected]: props.selected
      })}
    >
      {children}
    </div>
  );
};
