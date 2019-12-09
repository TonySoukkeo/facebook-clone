import React from "react";
import { Link } from "react-router-dom";
import Loading from "../../../common/helpers/Loading";

const MobileToolbar = ({
  userId,
  profilePageUserId,
  isFriends,
  addFriend,
  onClickToggleFriendOption,
  toggleFriendOption,
  removeFriend,
  sendMessage,
  loading,
  pendingRequest,
  cancelRequest
}) => {
  return (
    <div className="profile-page__toolbar">
      {userId === profilePageUserId ? (
        <Link
          to={`/update-profile/${userId}`}
          className="profile-page__toolbar-button-wrapper"
        >
          <div className="profile-page__toolbar-button--icon">
            <i className="fas fa-pencil-alt"></i>
          </div>
          <p className="profile-page__toolbar-button--text">Update Info</p>
        </Link>
      ) : (
        <div className="profile-page__toolbar-button-wrapper">
          {pendingRequest ? (
            <React.Fragment>
              <div className="profile-page__toolbar-button--icon">
                {loading &&
                loading.type === "cancel request" &&
                loading.userId === userId ? (
                  <Loading />
                ) : (
                  <i onClick={cancelRequest} className="fas fa-share"></i>
                )}
              </div>
              <p className="profile-page__toolbar-button--text">Request Sent</p>
            </React.Fragment>
          ) : !isFriends ? (
            <React.Fragment>
              <div className="profile-page__toolbar-button--icon">
                {loading &&
                loading.type === "send request" &&
                loading.userId === userId ? (
                  <Loading />
                ) : (
                  <i onClick={addFriend} className="fas fa-user-plus"></i>
                )}
              </div>
              <p className="profile-page__toolbar-button--text">Add Friend</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="profile-page__toolbar-button--icon">
                {loading.value &&
                loading.type === "remove friend" &&
                loading.userId === userId ? (
                  <Loading />
                ) : (
                  <i
                    onClick={onClickToggleFriendOption}
                    className="fas fa-user-check color-blue"
                  ></i>
                )}

                {toggleFriendOption ? (
                  <ul className="profile-page__toolbar-option">
                    <li
                      onClick={removeFriend}
                      className="profile-page__toolbar-option-item"
                    >
                      Remove Friend
                    </li>
                  </ul>
                ) : null}
              </div>
              <p className="profile-page__toolbar-button--text">Friends</p>
            </React.Fragment>
          )}
        </div>
      )}

      {userId !== profilePageUserId ? (
        <Link
          to={`/message-single/${userId}`}
          onClick={sendMessage}
          className="profile-page__toolbar-button-wrapper"
        >
          <div className="profile-page__toolbar-button--icon">
            <div className="circle circle--dark">
              <i className="fas fa-comment-dots"></i>
            </div>
          </div>
          <div className="profile-page__toolbar-button--text">
            <p>Message</p>
          </div>
        </Link>
      ) : null}
    </div>
  );
};

export default MobileToolbar;
