import React from "react";
import { Link } from "react-router-dom";

const Friends = ({ user, profilePageUserId, windowWidth, friends }) => {
  return (
    <div className="profile-page__friends">
      <div className="profile-page__friends-header">
        <Link
          to={`/profile/friends/${profilePageUserId}`}
          className="profile-page__friends--link"
        >
          {windowWidth > 790 ? (
            <div className="circle circle--sm circle--bgred">
              <i className="fas fa-user-friends"></i>
            </div>
          ) : null}

          <h3>Friends</h3>

          {windowWidth > 790 ? (
            <div className="profile-page__friends-total">
              <p>{user && user.friends.length}</p>
            </div>
          ) : null}
        </Link>
        <Link to="/search" className="profile-page__friends-link">
          Find Friends
        </Link>
      </div>

      {windowWidth < 790 ? (
        <div className="profile-page__friends-total">
          <p>{user && user.friends.length}</p>
        </div>
      ) : null}

      <div className="profile-page__friends-list">
        {friends
          ? friends.map(friend => (
              <div key={friend._id} className="profile-page__friends-item">
                <Link
                  to={`/profile/${friend._id}`}
                  className="profile-page__friends-link"
                >
                  <div className="profile-page__friends-image">
                    <img
                      src={friend.profileImage.imageUrl}
                      alt="Friend"
                      className="profile-img"
                    />
                  </div>
                  <div className="profile-page__friends-text">
                    {friend.fullName}
                  </div>
                </Link>
              </div>
            ))
          : "No friends"}
      </div>
      {windowWidth < 790 ? (
        <Link
          to={`/profile/friends/${profilePageUserId}`}
          className="profile-page__button"
        >
          See All Friends
        </Link>
      ) : null}
    </div>
  );
};

export default Friends;
