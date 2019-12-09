import React, { Component } from "react";
import { connect } from "react-redux";
import TextArea from "../../common/form/TextArea";
import ImageInput from "../../common/form/ImageInput";
import { postStatus } from "../../controllers/post";
import Loading from "../../common/helpers/Loading";

class PostStatus extends Component {
  state = {
    privacy: "public",
    privacyToggle: false,
    status: "",
    image: null,
    imageData: null
  };

  changePrivacy = value => {
    this.setState({ privacy: value, privacyToggle: false });
  };

  togglePrivacy = () => {
    const { privacyToggle } = this.state;

    this.setState({ privacyToggle: !privacyToggle });
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  selectImage = e => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        this.setState({ image: e.target.result });
      };
      this.setState({ imageData: e.target.files[0] });
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };

  removeImage = () => {
    this.setState({
      image: null,
      imageData: null
    });
  };

  postStatus = e => {
    e.preventDefault();

    const { status, imageData, privacy } = this.state,
      { token, postStatus, userId } = this.props;

    const postData = {
      post: status,
      image: imageData,
      privacy
    };

    postStatus(postData, token, this.props, userId);

    // Reset value input
    this.setState({ status: "" });
  };

  render() {
    const { currentUser, alert, isLoading, className, userId } = this.props,
      { privacy, privacyToggle, status, image } = this.state;

    let display, alertDisplay;

    // Set up alert
    if (alert) {
      alertDisplay = <div className="alert alert--error">{alert.message}</div>;
    }

    if (currentUser) {
      display = (
        <div className={`${className} post-status`}>
          {/**** Status header ****/}
          <div className="post-status__header container">
            {/*** Profile image ***/}
            <div className="user-image user-image--md">
              <img
                src={currentUser.profileImage.imageUrl}
                alt="profile"
                className="profile-img"
              />
            </div>

            <div className="post-status__meta">
              {/*** Profile name ***/}
              <div className="post-status__meta-name">
                <p>{currentUser.fullName}</p>
              </div>

              {/*** Post Privacy ***/}
              <div className="post-status__privacy">
                {privacy === "friends" ? (
                  <span>
                    <i className="fas fa-user-friends"></i>
                  </span>
                ) : (
                  <span>
                    <i className="fas fa-globe-americas"></i>
                  </span>
                )}
                <p>
                  Share with:{" "}
                  {privacy === "friends" ? (
                    <span>Your friends</span>
                  ) : (
                    <span>The public</span>
                  )}
                  <span className="ml-sm">
                    <i
                      onClick={this.togglePrivacy}
                      className="fas fa-caret-down dropdown-icon"
                    ></i>
                  </span>
                </p>
              </div>
              {/**** Privacy settings toggle ****/}
              {privacyToggle ? (
                <ul className="post-status__privacy-list">
                  <li
                    onClick={() => this.changePrivacy("friends")}
                    className="post-status__privacy-item"
                  >
                    Friends
                  </li>

                  <li
                    onClick={() => this.changePrivacy("public")}
                    className="post-status__privacy-item"
                  >
                    Public
                  </li>
                </ul>
              ) : null}
            </div>
          </div>

          {/**** Display error alert if any ***/}
          {alertDisplay}

          {/**** Status comment ****/}
          <form onSubmit={this.postStatus} className="post-status__form">
            <TextArea
              classname="post-status__comment"
              placeholder="What's on your mind?"
              onChange={this.onChange}
              value={status}
              name="status"
            />
            {/*** Show image Preview ***/}
            {image ? (
              <div className="container">
                <div className="post-status__comment-image">
                  <div
                    onClick={this.removeImage}
                    className="post-status__comment-image--icon"
                  >
                    <i className="fas fa-times"></i>
                  </div>
                  <img src={image} className="profile-img" alt="Preview" />
                </div>
              </div>
            ) : null}

            <ul className="post-status__form-list">
              <li className="post-status__form-item">
                <ImageInput
                  onChange={this.selectImage}
                  text="Photo"
                  name="image"
                  classname="post-status__form-image-input"
                />
              </li>
            </ul>
            <div className="post-status__form-container">
              <button
                type="submit"
                disabled={status === ""}
                className={
                  status === ""
                    ? "btn btn--post-status disabled"
                    : "btn btn--post-status"
                    ? isLoading.value &&
                      isLoading.type === "post status" &&
                      isLoading.userId === userId
                      ? "btn btn--post-status flex dark-overlay text-grey"
                      : "btn btn--post-status"
                    : null
                }
              >
                {isLoading.value &&
                isLoading.type === "post status" &&
                isLoading.userId === userId ? (
                  <Loading />
                ) : null}{" "}
                Post
              </button>
            </div>
          </form>
        </div>
      );
    }
    return (
      <React.Fragment>
        {/* <SecondaryNavigation navTitle="Status" /> */}
        {display}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token,
  alert: state.alert.alert,
  isLoading: state.loading.loading,
  userId: state.auth.userId
});

const actions = {
  postStatus
};

export default connect(mapStateToProps, actions)(PostStatus);
