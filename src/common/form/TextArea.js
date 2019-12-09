import React from "react";

const TextArea = ({
  type = "text",
  placeholder,
  classname,
  onChange,
  value,
  name
}) => {
  return (
    <React.Fragment>
      <textarea
        className={classname}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        name={name}
        rows={1}
      />
    </React.Fragment>
  );
};

export default TextArea;
