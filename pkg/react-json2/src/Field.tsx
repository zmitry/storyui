import React, {
  useState,
  useRef,
  useLayoutEffect,
  createContext,
  useContext
} from "react";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import upd from "lodash/update";
import set from "lodash/set";

const FieldContext = createContext({
  value: null,
  update: null
} as any);

export function FieldProvider({ initialValue, children }) {
  const [value, update] = useState(initialValue);

  return (
    <FieldContext.Provider
      value={{
        value,
        update
      }}
    >
      {children}
    </FieldContext.Provider>
  );
}

function setValue(value, path, v) {
  if (path.length > 0) {
    return set(value, path, v);
  } else {
    return v;
  }
}

export function useField(path: string[]) {
  const { value, update } = useContext(FieldContext);

  return {
    value: path.length ? get(value, path) : value,
    update: (newFieldValue, p = []) => {
      const v2 = setValue(cloneDeep(value), path.concat(p), newFieldValue);
      return update(v2);
    },

    updateKey: (newKeyValue, key) => {
      if (path.length === 0) {
        const { [key]: v, ...obj } = value;
        return update({ [newKeyValue]: v, ...obj });
      }
      return update(
        upd(cloneDeep(value), path, ({ [key]: v, ...obj }) => {
          return { [newKeyValue]: v, ...obj };
        })
      );
    }
  };
}

export function FieldAdder({ onBlur, ...props }) {
  return (
    <span className="adder-group">
      <Field
        changeable={false}
        value=""
        posType="name"
        defaultEditable={true}
        onBlur={(e, val) => {
          onBlur(val, "");
        }}
        className="adder input"
      />
      :
    </span>
  );
}

export function Field({
  value,
  posType,
  before = null,
  className = "",
  onBlur = null,
  defaultEditable = false,
  changeable = false
}) {
  const [editable, setEditable] = useState(defaultEditable);
  const [type, setType] = useState(typeof value as any);

  const [val, setValue] = useState(value);
  const ref = useRef(null);
  const selectTargetRef = useRef(null);

  const classNameComposed = [posType, type, className].join(" ");
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [editable]);
  const onBlurInternal = e => {
    e.preventDefault();
    if (!selectTargetRef.current) {
      if (ref.current !== e.relatedTarget) {
        setEditable(false);
        onBlur && onBlur(e, val);
      }
    } else if (
      selectTargetRef.current &&
      selectTargetRef.current !== e.relatedTarget &&
      ref.current !== e.relatedTarget
    ) {
      setEditable(false);
      onBlur && onBlur(e, val);
    }
  };

  if (editable || type === "checkbox") {
    return (
      <span className={classNameComposed + " editable"} onBlur={onBlurInternal}>
        {changeable && (
          <select
            className="type-select"
            value={type}
            ref={selectTargetRef}
            onChange={e => {
              ref.current.focus();
              const val = e.target.value;
              setType(val as any);
              if (val === "map") {
                // setValue({});
                onBlur && onBlur(e, {});
              } else if (val === "array") {
                onBlur && onBlur(e, []);
              } else if (val === "date") {
                setValue(new Date());
              }
            }}
          >
            <option label="text">text</option>
            <option label="number">number</option>
            <option label="select">select</option>
            <option label="checkbox">checkbox</option>
            <option label="search">search</option>
            <option label="date">date</option>
            <option label="map">map</option>
            <option label="array">array</option>
          </select>
        )}
        <span> </span>
        <input
          size={Math.min(Math.max(val.length, 3), 20)}
          ref={ref}
          value={val}
          checked={type === "checkbox" ? val : undefined}
          onChange={e => {
            if (type === "checkbox") {
              setValue(e.target.checked);
            } else {
              setValue(e.target.value);
            }
          }}
          style={{ maxWidth: 3 + String(val).length + "ch" }}
          type={type}
          onKeyDown={e => {
            if (e.which == 13) {
              onBlur(e);
            }
          }}
        />
      </span>
    );
  }
  return (
    <span className={classNameComposed} onClick={v => setEditable(true)}>
      {before}
      {val === "" || val === undefined || val === null ? (
        <span className="null-value">empty</span>
      ) : (
        String(val)
      )}
    </span>
  );
}
