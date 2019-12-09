import React from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

const NotificationsList = ({
  sourcePostId,
  userImage,
  message,
  alertType,
  date,
  friendId
}) => {
  return (
    <ul className="notifications__list">
      <Link
        to={
          alertType === "friend request"
            ? `/profile/${friendId}`
            : `/comment/${sourcePostId}`
        }
        className="notifications__item p-sm"
      >
        <div className="user-image user-image--sm-2">
          <img className="profile-img" src={userImage} alt="Profile" />
        </div>

        <div className="notifications__item-content">
          <div className="notifications__item-content--text">{message}</div>

          <div className="notifications__item-content--timestamp">
            {alertType === "like" ? (
              <span className="notifications__like-icon">
                <i className="fas fa-thumbs-up"></i>
              </span>
            ) : (
              <span className="notifications__comment-icon">
                <i className="fas fa-comment-alt"></i>
              </span>
            )}{" "}
            <Moment fromNow>{date}</Moment>
          </div>
        </div>
      </Link>
    </ul>
  );
};

export default NotificationsList;
