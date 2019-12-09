import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";

const PostHeader = ({
  profileImage,
  timestamp,
  fullName,
  privacy,
  toggleEdit,
  userId,
  creatorId
}) => {
  return (
    <React.Fragment>
      <Link
        to={`/profile/${creatorId}`}
        className="posts__header-image user-image"
      >
        <img src={profileImage} className="profile-img" alt="Profile" />
      </Link>
      <div className="posts__header-title">
        <Link to={`/profile/${creatorId}`} className="posts__header-name">
          {fullName}
        </Link>
        <div className="posts__header-timestamp">
          <span>
            <Moment fromNow>{timestamp}</Moment>
          </span>

          <span className="posts__header-timestamp--privacy">
            {privacy === "public" ? (
              <i className="fas fa-globe-americas"></i>
            ) : (
              <i className="fas fa-user-friends"></i>
            )}
          </span>
        </div>
      </div>
      {userId === creatorId ? (
        <div onClick={toggleEdit} className="posts__header-edit">
          <i className="fas fa-ellipsis-h"></i>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default PostHeader;
