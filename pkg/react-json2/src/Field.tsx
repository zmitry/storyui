import React, {
  useState,
  useRef,
  createContext,
  useContext,
  forwardRef
} from "react";
import upd from "lodash/update";

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

function deletePropertyPath(obj, path) {
  if (!obj || !path) {
    return;
  }

  for (var i = 0; i < path.length - 1; i++) {
    obj = obj[path[i]];

    if (typeof obj === "undefined") {
      return;
    }
  }

  Reflect.deleteProperty(obj, path.pop());
}

export function useField2() {
  const { value, update } = useContext(FieldContext);

  return {
    value: value,
    update: (p = [], newFieldValue) => {
      const v2 = upd({ ...value }, p, newFieldValue);
      return update(v2);
    },
    dropPath(path) {
      deletePropertyPath(value, path);
      update({ ...value });
    },
    updateKey: (newKeyValue, key, path) => {
      return update(
        upd({ ...value }, path, ({ [key]: v, ...obj }) => {
          return { [newKeyValue]: v, ...obj };
        })
      );
    }
  };
}

export function FieldAdder({ onBlur, ...props }) {
  let v;
  return (
    <span className="adder-group" {...props}>
      <Field
        changeable={false}
        value=""
        posType="name"
        defaultEditable={true}
        onBlur={(e, val) => {
          v = val;
        }}
        className="adder input"
      />
      :
      <SelectType />
      <button
        onClick={() => {
          onBlur(v, "");
        }}
      >
        ok
      </button>
    </span>
  );
}

const SelectType = forwardRef((props, ref) => {
  return (
    <select className="type-select" ref={ref as any} {...props}>
      <option label="text">text</option>
      <option label="number">number</option>
      <option label="select">select</option>
      <option label="checkbox">checkbox</option>
      <option label="search">search</option>
      <option label="date">date</option>
      <option label="map">map</option>
      <option label="array">array</option>
    </select>
  );
});
export function Field({
  value,
  posType,
  before = null,
  className = "",
  onBlur = null,
  defaultEditable = false,
  changeable = false
}) {
  const [editable, setEditable] = useState(!!value);
  const [type, setType] = useState(typeof value as any);

  const [val, setValue] = useState(value);
  const ref = useRef(null);
  const selectTargetRef = useRef(null);

  const classNameComposed = [posType, type, className].join(" ");
  // useLayoutEffect(() => {
  //   if (ref.current) {
  //     ref.current.focus();
  //     ref.current.select();
  //   }
  // }, [editable]);
  const onBlurInternal = e => {
    e.preventDefault();
    if (!selectTargetRef.current) {
      if (ref.current !== e.relatedTarget) {
        // setEditable(false);
        onBlur && onBlur(e, val);
      }
    } else if (
      selectTargetRef.current &&
      selectTargetRef.current !== e.relatedTarget &&
      ref.current !== e.relatedTarget
    ) {
      // setEditable(false);
      onBlur && onBlur(e, val);
    }
  };

  if (editable) {
    return (
      <span
        onClick={e => {
          ref.current.select();
        }}
        className={classNameComposed + " editable"}
        onBlur={onBlurInternal}
      >
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
              onBlurInternal(e);
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
        <span className="null-value">{JSON.stringify(val)}</span>
      ) : (
        String(val)
      )}
    </span>
  );
}
