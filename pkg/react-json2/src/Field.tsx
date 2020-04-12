import React, { useState, useRef, useLayoutEffect } from "react";

export function FieldAdder({ onBlur, ...props }) {
  const [key, setKey] = useState("");
  return (
    <span className="adder-group">
      <Field
        changeable={true}
        value=""
        posType="name"
        defaultEditable={true}
        onBlur={(e, val) => {
          onBlur(val, "");
          setKey(val);
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
              setType(e.target.value as any);
              setValue("");
            }}
          >
            <option label="text">text</option>
            <option label="number">number</option>
            <option label="select">select</option>
            <option label="checkbox">checkbox</option>
            <option label="search">search</option>
            <option label="date">date</option>
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
