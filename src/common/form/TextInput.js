import React from "react";

const TextInput = ({
  type,
  id,
  name,
  value,
  onChange,
  className,
  error,
  placeholder,
  disabled,
  onBlur
}) => {
  return (
    <React.Fragment>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
      />
      {error && error.name === name ? (
        <div className="error-input mt-sm">{error.message}</div>
      ) : null}
    </React.Fragment>
  );
};

export default TextInput;
