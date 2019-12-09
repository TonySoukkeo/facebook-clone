import React, { Component } from "react";
import ImageInput from "../../../common/form/ImageInput";
import { Link } from "react-router-dom";
import Loading from "../../../common/helpers/Loading";

class Banner extends Component {
  state = {
    toggleFriend: false
  };

  toggleFriend = () => {
    const { toggleFriend } = this.state;

    this.setState({ toggleFriend: !toggleFriend });
  };
  render() {
    const {
      user,
      profilePageUserId,
      imageUpload,
      selectImageType,
      userId,
      windowWidth,
      isFriends,
      addFriend,
      removeFriend,
      pendingRequest,
      cancelRequest,
      loading
    } = this.props;

    const { toggleFriend } = this.state;

    return (
      <React.Fragment>
        <div className="profile-page__banner">
          <img
            src={user && user.bannerImage.imageUrl}
            alt="Banner"
            className="profile-page__image"
          />
          {userId === profilePageUserId ? (
            <ImageInput
              onChange={imageUpload}
              text="Edit"
              classname="profile-page__image-edit profile-page__image-edit--banner"
              onClick={() => selectImageType("banner")}
            />
          ) : null}

          {windowWidth > 790 ? (
            <div className="profile-page__banner--toolbar">
              {userId === profilePageUserId ? (
                <Link
                  to={`/update-profile/${userId}`}
                  className="profile-page__banner--btn"
                >
                  Update Info
                </Link>
              ) : (
                <React.Fragment>
                  {pendingRequest ? (
                    <button
                      onClick={cancelRequest}
                      className="profile-page__banner--btn"
                    >
                      {loading.value && loading.userId === userId ? (
                        <Loading />
                      ) : (
                        <React.Fragment>
                          <i className="fas fa-share"></i> Request Sent
                        </React.Fragment>
                      )}
                    </button>
                  ) : !isFriends ? (
                    <button
                      onClick={addFriend}
                      className="profile-page__banner--btn"
                    >
                      {loading.value && loading.userId === userId ? (
                        <Loading />
                      ) : (
                        <React.Fragment>
                          <i className="fas fa-user-plus"></i> Add Friend
                        </React.Fragment>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={this.toggleFriend}
                      className="profile-page__banner--btn"
                    >
                      {loading.value && loading.userId === userId ? (
                        <Loading />
                      ) : (
                        <React.Fragment>
                          <i className="fas fa-check"></i> Friends
                        </React.Fragment>
                      )}

                      {toggleFriend ? (
                        <div
                          onClick={removeFriend}
                          className="profile-page__banner--dropdown"
                        >
                          Unfriend
                        </div>
                      ) : null}
                    </button>
                  )}

                  <button className="profile-page__banner--btn">
                    <i className="fab fa-facebook-messenger"></i> Message
                  </button>
                </React.Fragment>
              )}
            </div>
          ) : null}
        </div>

        {/*** Profile Image ***/}
        <div className="profile-page__image-container">
          <div className="profile-page__image-container-image">
            <img
              src={user && user.profileImage.imageUrl}
              alt="Profile"
              className="profile-page__image"
            />

            {userId === profilePageUserId ? (
              <ImageInput
                onChange={imageUpload}
                text="Edit"
                classname="profile-page__image-edit profile-page__image-edit--desktop"
                onClick={() => selectImageType("profile")}
              />
            ) : null}
          </div>
          <p className="profile-page__image-container-name">
            {`${user && user.firstName} ${user && user.lastName}`}
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default Banner;
