import React from "react";
import { Link } from "react-router-dom";

const SettingsDropdown = ({ privacy, id, toggleDelete }) => {
  return (
    <ul className="posts__header-list">
      <div className="posts__header-list--arrow"></div>
      <Link to={`/edit-privacy/${id}`} className="posts__header-item">
        {privacy === "public" ? (
          <span>
            <i className="fas fa-globe-americas"></i>
          </span>
        ) : (
          <span>
            <i className="fas fa-user-friends"></i>
          </span>
        )}{" "}
        Edit privacy
      </Link>
      <Link to={`/edit-post/${id}`} className="posts__header-item">
        <span>
          <i className="fas fa-pencil-alt"></i>
        </span>{" "}
        Edit post
      </Link>
      <li onClick={toggleDelete} className="posts__header-item">
        <span>
          <i className="far fa-trash-alt"></i>
        </span>
        Delete post
      </li>
    </ul>
  );
};

export default SettingsDropdown;
