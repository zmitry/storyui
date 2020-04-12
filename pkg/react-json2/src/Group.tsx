import React, {
  useState,
  useLayoutEffect,
  createContext,
  useContext,
  forwardRef,
  useImperativeHandle
} from "react";
import { Button } from "./Button";

const CollapseContext = createContext({
  collapsed: false,
  inline: false
});

function useCollapseContext() {
  return useContext(CollapseContext);
}

function useGroup({ parentCollapsed }) {
  const [collapsed, setCollapsed] = useState(false);
  const className = "bg " + (collapsed ? "collapsed" : "");
  const toggleCollapsed = () => {
    setCollapsed(s => {
      return !s;
    });
  };

  useLayoutEffect(() => {
    setCollapsed(parentCollapsed);
  }, [parentCollapsed]);
  return {
    collapsed,
    className,
    toggleCollapsed
  };
}

type GroupProps = {
  children: React.ReactNode;
  title?: React.ReactNode;
  type: string;
  className?: string;
  end?: React.ReactNode;
  [s: string]: any;
};

export const Group = forwardRef(function Group(
  {
    children,
    title,
    type,
    className,
    showCollapsed = true,
    end = null,
    ...props
  }: GroupProps,
  ref
) {
  const parent = useCollapseContext();
  const {
    collapsed: inline,
    toggleCollapsed,
    className: inlineClassname
  } = useGroup({
    parentCollapsed: parent.collapsed
  });
  const renderBracket = t =>
    t === "start" ? (type === "map" ? "{" : "[") : type === "map" ? "}" : "]";
  useImperativeHandle(ref, () => ({
    collapse() {
      toggleCollapsed();
    }
  }));
  if (parent.collapsed) {
    return (
      <span ref={ref as any} onClick={toggleCollapsed} {...props}>
        {renderBracket("start")}
        {`…`}
        {renderBracket("end")}
      </span>
    );
  }

  return (
    <CollapseContext.Provider value={{ collapsed: inline, inline: inline }}>
      <span
        ref={ref as any}
        onClick={inline ? toggleCollapsed : undefined}
        {...props}
        className={[className, "group", inlineClassname].join(" ")}
      >
        <span className="start-paren">
          {renderBracket("start")}
          {showCollapsed && (
            <Button
              title="Collapse"
              data-balloon-pos="down"
              onClick={!inline ? toggleCollapsed : undefined}
            >
              ▲
            </Button>
          )}
          {title}
        </span>
        {children}
        <span className="closing-group">
          <span className="end-paren">{renderBracket("end")}</span>
          {end}
        </span>
      </span>
    </CollapseContext.Provider>
  );
});
