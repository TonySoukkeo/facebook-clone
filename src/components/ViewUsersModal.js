import React from "react";
import { Link } from "react-router-dom";

const ViewUsersModal = ({ onClick, users }) => {
  return (
    <div className="modal-overlay modal-overlay--active">
      <div className="modal modal--active modal__view-users">
        <i onClick={onClick} className="fas fa-times"></i>

        <ul className="modal__view-users-list">
          {users.map(user => (
            <Link
              to={`/profile/${user.userId._id}`}
              className="modal__view-users-item"
            >
              <div className="user-image">
                <img
                  src={user.userId.profileImage.imageUrl}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <p>{user.userId.fullName}</p>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUsersModal;
