import React from "react";

const ImageEditButton = () => {
  return (
    <React.Fragment>
      <input type="file" name="image" id="image" />

      <label htmlFor="image" className="profile-page__image-edit">
        <span>
          <i className="fas fa-camera"></i>
        </span>
        <span>Edit</span>
      </label>
    </React.Fragment>
  );
};

export default ImageEditButton;
