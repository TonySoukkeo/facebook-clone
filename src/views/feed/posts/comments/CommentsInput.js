import React from "react";
import TextArea from "../../../../common/form/TextArea";
import ImageInput from "../../../../common/form/ImageInput";
import Loading from "../../../../common/helpers/Loading";

const CommentsInput = ({
  classname,
  placeholder,
  name,
  onChange,
  value,
  currentUserProfileImage,
  selectImage,
  removeImage,
  replyImagePreview,
  image,
  isReplying,
  onClick,
  loading,
  userId
}) => {
  return (
    <React.Fragment>
      <div className="form__group form__group--comment">
        <div className="profile-image-wrapper">
          <div className="user-image">
            <img
              src={currentUserProfileImage}
              alt="Profile"
              className="profile-img"
            />
          </div>
        </div>

        <TextArea
          classname={classname}
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          value={value}
        />

        <button
          type="submit"
          disabled={value === ""}
          className={
            value !== ""
              ? "posts__comments--btn posts__comments--btn-active"
              : "posts__comments--btn"
          }
        >
          {loading.value && loading.userId === userId ? <Loading /> : "Post"}
        </button>
      </div>

      <div className="form__group form__group--image">
        {/**** Image preview ***/}
        {!isReplying && image ? (
          <div className="container">
            <div className="post-status__comment-image">
              <div
                onClick={removeImage}
                className="post-status__comment-image--icon"
              >
                <i className="fas fa-times"></i>
              </div>
              <img src={image} className="profile-img" alt="Preview" />
            </div>
          </div>
        ) : null}

        {isReplying && replyImagePreview ? (
          <div className="container">
            <div className="post-status__comment-image">
              <div
                onClick={removeImage}
                className="post-status__comment-image--icon"
              >
                <i className="fas fa-times"></i>
              </div>
              <img
                src={replyImagePreview}
                className="profile-img"
                alt="Preview"
              />
            </div>
          </div>
        ) : null}

        <ImageInput
          onChange={selectImage}
          name={isReplying ? "replyImagePreview" : "image"}
          classname="post-status__form-image-input"
          onClick={onClick}
        />
      </div>
    </React.Fragment>
  );
};

export default CommentsInput;
