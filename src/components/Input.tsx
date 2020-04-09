import React from "react";
// import TextareaAutosize from "react-textarea-autosize";
import { css, cx } from "emotion";

type Props = Record<string, any> & {
  type: string;
  label: string;
  helper?: string;
  value?: string;
};

const classes = {
  label: css`
    font-size: 1rem;
    padding-right: 12px;
    padding-bottom: 4px;
    opacity: 1;
    font-weight: 500;
    text-align: left;
    vertical-align: middle;
    display: inline-block;
  `,
  input: css`
    width: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    -webkit-appearance: none;
    font-size: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    height: 2.5rem;
    background-color: rgb(255, 255, 255);
    transition: all 0.2s ease 0s;
    border: 1px solid hsla(0, 0%, 80%, 1);
    border-radius: 0.25rem;
    border-width: 1px;
    border-style: solid;
    border-image: initial;
    :focus {
      z-index: 1;
      box-shadow: rgb(49, 130, 206) 0px 0px 0px 1px;
      border-color: rgb(49, 130, 206);
    }
    :hover {
      border-color: rgb(203, 213, 224);
    }
  `,
  helper: css`
    margin-top: 0.5rem;
    color: rgb(113, 128, 150);
    line-height: normal;
    font-size: 0.875rem;
  `,
  textarea: css`
    padding-top: 10px;
    padding-bottom: 10px;
  `
};

export function Label({ children, label }) {
  return (
    <div className="group">
      <label className={classes.label}>{label}</label>
      {children}
    </div>
  );
}
export const Input = React.forwardRef(
  ({ className, type, helper, label, defaultValue, ...props }: Props, ref: any) => {
    let input = <input className={cx(classes.input, className)} type={type} {...props} />;
    if (type === "textarea") {
      // not implemented
      // input = (
      //   <TextareaAutosize
      //     className={cx(classes.input, classes.textarea, className)}
      //     type={type}
      //     maxRows={8}
      //     {...props}
      //   />
      // );
    } else if (type === "select") {
      input = <select ref={ref} className={cx(classes.input, className)} {...(props as any)} />;
    }
    return (
      <div className="group">
        <label className={classes.label}>{label}</label>
        {input}
        {helper && <span className={classes.helper}>{helper}</span>}
      </div>
    );
  }
);
