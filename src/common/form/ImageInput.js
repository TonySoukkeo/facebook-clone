import React from "react";

const ImageInput = ({ classname, onChange, onClick, text, name }) => {
  return (
    <React.Fragment>
      <input type="file" name={name} id="image" onChange={onChange} />

      <label onClick={onClick} htmlFor="image" className={classname}>
        <span>
          <i className="fas fa-camera"></i>
        </span>
        <span>{text}</span>
      </label>
    </React.Fragment>
  );
};

export default ImageInput;
