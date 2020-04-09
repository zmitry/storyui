import React from "react";
import { css } from "emotion";
import { theme } from "../theme";
import { Stack } from "./Layout";

const classes = {
  card: css`
    box-shadow: var(--shadow1);
    padding: 10px;
    background: white;
    border: 1px solid ${theme.dividerInverted};
    border-radius: 3px;
    margin: auto;
    position: relative;
    width: 100%;
  `,
  divider: css`
    height: 2px;
    width: 100%;
    box-shadow: inset 0px -1px ${theme.dividerInverted};
    margin-left: -10px;
    margin-right: -10px;
    position: absolute;
    grid-column: 1/2;
    grid-row: 2/2;
  `
};
export interface CardProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

function Divider() {
  return (
    <div>
      <div className={classes.divider} />
    </div>
  );
}

export function Card(props: CardProps) {
  return (
    <div className={classes.card}>
      <Stack gap={10}>
        {props.title}
        <Divider />
        {React.Children.map(props.children, (el, i) => {
          return (
            <>
              {i > 0 && el && <Divider />}
              {el}
            </>
          );
        })}
      </Stack>
    </div>
  );
}
