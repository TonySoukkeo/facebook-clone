import React from "react";
import { NavLink } from "react-router-dom";

const MobileNavigation = ({
  clearFriendRequest,
  currentUser,
  friendRequest,
  clearMessageCount,
  clearNotifications,
  messages,
  notifications
}) => {
  return (
    <ul className="navigation__list">
      <li className="navigation__item">
        <NavLink
          exact
          to="/"
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i className="far fa-newspaper"></i>
        </NavLink>
      </li>
      <li onClick={clearFriendRequest} className="navigation__item">
        <NavLink
          to={`/friend-requests/${currentUser && currentUser._id.toString()}`}
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i
            className={
              friendRequest && friendRequest.count > 0
                ? "fas fa-user-friends notification-alert"
                : "fas fa-user-friends"
            }
          >
            {friendRequest && friendRequest.count > 0 ? (
              <div className="notification-count notification-count--friends">
                {friendRequest.count}
              </div>
            ) : null}
          </i>
        </NavLink>
      </li>
      <li onClick={clearMessageCount} className="navigation__item">
        <NavLink
          to={`/messaging/${currentUser && currentUser._id.toString()}`}
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i
            className={
              messages && messages.count > 0
                ? "fa fa-comment notification-alert"
                : "fa fa-comment"
            }
          >
            {messages && messages.count > 0 ? (
              <div className="notification-count">{messages.count}</div>
            ) : null}
          </i>
        </NavLink>
      </li>
      <li onClick={clearNotifications} className="navigation__item">
        <NavLink
          to={`/notifications/${currentUser && currentUser._id.toString()}`}
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i
            className={
              notifications && notifications.count > 0
                ? "fas fa-bell notification-alert"
                : "fas fa-bell"
            }
          >
            {notifications && notifications.count > 0 ? (
              <div className="notification-count">{notifications.count}</div>
            ) : null}
          </i>
        </NavLink>
      </li>
      <li className="navigation__item">
        <NavLink
          to="/search"
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i className="fas fa-search"></i>
        </NavLink>
      </li>
      <li className="navigation__item">
        <NavLink
          to="/settings"
          className="navigation__link"
          activeClassName="navigation__link--active"
        >
          <i className="fas fa-bars"></i>
        </NavLink>
      </li>
    </ul>
  );
};

export default MobileNavigation;
