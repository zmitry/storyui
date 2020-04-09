import React, { useState } from "react";
import { HStack, Stack } from "./Layout";
import { theme } from "../theme";
import { ExpandIcon, FolderIcon, BurgerIcon, IconButton } from "./Icons";
import { Text } from "./Text";
import { css } from "emotion";

type TextItem = {
  tag?: string;
  title: string;
  link: string;
  key: string;
};
type Folder = {
  tag?: string;
  title: string;
  items: Item[];
};

type Header = {
  title: string;
};

type Item = TextItem | Folder;
export interface SidePanelProps {
  defaultTag?: string;
  tree: Item[];
  onClick?: (i: Item) => void;
  selected: string;
}
function Icon({ children, ...rest }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      color={theme.iconPrimary}
      {...rest}
    >
      {children}
    </svg>
  );
}
function Folder({ expanded, children }) {
  return (
    <HStack gap={0} content="start" align="center">
      <Icon
        style={{
          transform: expanded ? "rotate(90deg)" : "",
        }}
      >
        <ExpandIcon />
      </Icon>
      <Icon style={{ marginLeft: 4 }}>
        <FolderIcon />
      </Icon>
      <div style={{ marginLeft: 6 }}>
        <Text>{children}</Text>
      </div>
    </HStack>
  );
}

const classes = {
  item: css`
    &:not(:first-of-type) {
      margin-top: 15px;
    }
  `,
};

function Header({ children }) {
  return (
    <a className={"uibook-sidepanel-el " + classes.item}>
      <div
        style={{
          marginLeft: 0,
          paddingLeft: 24,
          userSelect: "none",
          fontWeight: 900,
          fontSize: 16,
          color: "hsl(0, 0%, 56%)",
          letterSpacing: 2,
        }}
      >
        <Text>{children}</Text>
      </div>
    </a>
  );
}

function Item({
  children,
  depth = 1,
  selected = false,
  folder = false,
  onClick = null,
}) {
  const baseMargin = folder ? 3 : 4;
  const baseMarginAdd = folder ? 3 : 4;

  return (
    <a
      className={"uibook-sidepanel-item " + (selected ? "selected" : "")}
      onClick={onClick}
    >
      <div
        style={{
          userSelect: "none",
          paddingLeft:
            baseMarginAdd + (16 + baseMargin) * (depth - (folder ? 1 : 0)),
        }}
      >
        {children}
      </div>
    </a>
  );
}

export function SidePanel({
  tree,
  onClick,
  defaultTag = "components",
  selected,
}: SidePanelProps) {
  const [closed, setClosed] = useState(false);
  const items = toItems(tree, onClick, defaultTag, selected);
  if (closed) {
    return (
      <IconButton
        style={{
          position: "absolute",
          left: 5,
          top: 5,
          zIndex: 1,
        }}
        onClick={() => {
          setClosed(false);
        }}
      >
        <BurgerIcon style={{ width: 22, height: 22 }} />
      </IconButton>
    );
  }
  return (
    <nav
      style={{
        background: theme.backgroundPrimary,
        color: theme.textPrimary,
        paddingTop: 18,
        overflow: "auto",
        position: "relative",
        gridArea: "side",
        width: 350,
      }}
    >
      <IconButton
        style={{
          position: "absolute",
          right: 10,
        }}
        onClick={() => {
          setClosed(true);
        }}
      >
        <ExpandIcon
          style={{ transform: "rotate(180deg)", width: 18, height: 18 }}
        />
      </IconButton>
      <Stack gap={1}>{items}</Stack>
    </nav>
  );
}

const sortFn = (a, b) => {
  if (a.defaultTag > b.defaultTag) {
    return 1;
  } else if (a.defaultTag < b.defaultTag) {
    return -1;
  }
  return 1;
};
function toItems(
  tree: SidePanelProps["tree"],
  onClick: SidePanelProps["onClick"],
  defaultTag: string,
  selected: string
) {
  const [expanded, setExpanded] = useState(new Set());
  const queue = [
    ...tree.map((el) => ({ tag: defaultTag, ...el, depth: 1 })).sort(sortFn),
  ];
  const items = [];
  let lastTag = undefined;
  while (queue.length !== 0) {
    let item = queue.shift();
    let depth = item.depth;
    let key = item.depth + item.title;
    const tag = item.tag;
    if (lastTag !== tag) {
      items.push(<Header key={key}>{tag}</Header>);
      lastTag = tag;
    }
    if ("items" in item) {
      const ex = expanded.has(key);
      items.push(
        <Item
          folder
          key={key}
          depth={depth}
          onClick={() => {
            setExpanded((s) => {
              if (!s.has(key)) {
                s.add(key);
              } else {
                s.delete(key);
              }
              return new Set(s);
            });
          }}
        >
          <Folder expanded={ex}>{item.title}</Folder>
        </Item>
      );
      if (ex) {
        queue.unshift(
          ...item.items.map((el) => ({ ...el, depth: depth + 1, tag: tag }))
        );
      }
    } else {
      items.push(
        <Item
          selected={item.key === selected}
          onClick={() => onClick(item)}
          key={item.title + "" + item.depth}
          depth={item.depth}
        >
          <Text>{item.title}</Text>
        </Item>
      );
    }
  }
  return items;
}
