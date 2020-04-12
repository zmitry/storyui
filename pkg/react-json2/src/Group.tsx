import React, {
  useState,
  useLayoutEffect,
  createContext,
  useContext,
  forwardRef,
  useImperativeHandle
} from "react";
import { Button } from "./Button";
import { FieldAdder } from "./Field";

const CollapseContext = createContext({
  collapsed: false,
  inline: false
});

function useCollapseContext() {
  return useContext(CollapseContext);
}

function useGroup({ parentCollapsed }) {
  const [collapsed, setCollapsed] = useState(true);
  const className = "bg " + (collapsed ? "collapsed" : "");
  const toggleCollapsed = () => {
    setCollapsed(s => {
      return !s;
    });
  };

  //   useLayoutEffect(() => {
  //     setCollapsed(parentCollapsed);
  //   }, [parentCollapsed]);
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

function map<V, T>(
  obj: Record<string, V>,
  fn: (arg: [string, V], i: number) => T
) {
  return Object.entries(obj).map(fn);
}

export const Group = forwardRef(function Group(
  {
    children,
    title,
    type,
    className,
    showCollapsed = true,
    end = null,
    values,
    renderItem,
    onAdd,
    onAddIconClick,
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
  const [addEnabled, setAddEnable] = useState(false);

  const renderBracket = t =>
    t === "start" ? (type === "map" ? "{" : "[") : type === "map" ? "}" : "]";
  useImperativeHandle(ref, () => ({
    collapse() {
      toggleCollapsed();
    },
    insertEmpty() {
      setAddEnable(true);
    }
  }));
  if (inline) {
    return (
      <span
        ref={ref as any}
        className="start-paren"
        onClick={toggleCollapsed}
        {...props}
      >
        {renderBracket("start")}
        {Object.keys(values).length}
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
        <span className="start-paren" onClick={toggleCollapsed}>
          {/* {renderBracket("start")}
          {showCollapsed && (
            <Button
              title="Collapse"
              data-balloon-pos="down"
              onClick={!inline ? toggleCollapsed : undefined}
            >
              ▲
            </Button>
          )}
          {title} */}
          {renderBracket("start")}
          {Object.keys(values).length}
          {renderBracket("end")}
        </span>
        {map(values, ([key, value], i) => {
          return (
            <span className="entry-line">
              {renderItem(key, value)}
              {/* {i !== Object.keys(values).length - 1 && ","} */}
            </span>
          );
        })}
        {addEnabled && (
          <span className="entry-line">
            <FieldAdder
              onBlur={(key, v) => {
                if (key) {
                  onAdd(key, v);
                }
                setAddEnable(false);
              }}
            />
          </span>
        )}
        {children}
        <span className="closing-group">
          {/* <span className="end-paren">{renderBracket("end")}</span> */}
          <Button title="Add item" className="add-btn" onClick={onAddIconClick}>
            +
          </Button>
        </span>
      </span>
    </CollapseContext.Provider>
  );
});
