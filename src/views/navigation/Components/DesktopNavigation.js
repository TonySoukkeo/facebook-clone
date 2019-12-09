import React, { Component } from "react";
import TextInput from "../../../common/form/TextInput";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { searchUser } from "../../../controllers/user";

class DesktopNavigation extends Component {
  state = {
    search: "",
    users: [],
    toggleDropdown: false
  };

  _isMounted = false;
  componentDidMount() {
    this._isMounted = true;
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChange = async e => {
    const { search } = this.state;

    const value = e.target.value;
    this.setState({ [e.target.name]: value });

    const { searchUser, token } = this.props;

    if (this._isMounted) {
      const users = await searchUser(search, token);

      this.setState({ users });
    }
  };

  clearSearch = () => {
    this.setState({ users: [], search: "" });
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  handleClickOutside = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.clearSearch();
    }
  };

  toggleDropdown = () => {
    const { toggleDropdown } = this.state;

    this.setState({ toggleDropdown: !toggleDropdown });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.reload();
  };

  render() {
    const { users, search, toggleDropdown } = this.state;
    const {
      currentUser,
      friendRequest,
      clearFriendRequest,
      notifications,
      messages,
      clearMessageCount,
      clearNotifications
    } = this.props;

    let searchDisplay, dropdown;

    if (toggleDropdown) {
      dropdown = (
        <ul className="navigation__dropdown">
          <li onClick={this.logout} className="navigation__dropdown-list">
            Logout
          </li>
        </ul>
      );
    }

    if (currentUser && users.length > 0) {
      searchDisplay = (
        <ul className="navigation__search-list">
          {users.map(user => (
            <Link
              onClick={this.clearSearch}
              to={`profile/${user._id}`}
              key={user._id}
              className="navigation__search-item"
            >
              {user.fullName}
            </Link>
          ))}
        </ul>
      );
    }

    return (
      <ul ref={this.setWrapperRef} className="navigation__list">
        <li className="navigation__item navigation__item--search">
          <div className="logo">
            <p>f</p>
          </div>

          <form autoComplete="off" className="navigation__form">
            <TextInput
              type="text"
              name="search"
              onChange={this.onChange}
              className="navigation__search-input"
              placeholder="Search"
              value={search}
            />
            <i className="fas fa-search"></i>
            {searchDisplay}
          </form>
        </li>

        <div className="navigation__main-links">
          <Link
            to={`/profile/${currentUser && currentUser._id}`}
            className="navigation__main-links-item navigation__main-links-item--user"
          >
            <div className="user-image user-image--sm">
              <img
                src={currentUser && currentUser.profileImage.imageUrl}
                alt="Profile"
                className="profile-img"
              />
            </div>
            {currentUser && currentUser.firstName}
          </Link>

          <Link to="/" className="navigation__main-links-item">
            Home
          </Link>
          <div className="navigation__notification-links">
            <li onClick={clearFriendRequest} className="navigation__item">
              <Link
                to={`/friend-requests/${currentUser &&
                  currentUser._id.toString()}`}
                className="navigation__link"
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
              </Link>
            </li>

            <li onClick={clearMessageCount} className="navigation__item">
              <Link
                to={`/messaging/${currentUser && currentUser._id.toString()}`}
                className="navigation__link"
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
              </Link>
            </li>
            <li onClick={clearNotifications} className="navigation__item">
              <Link
                to={`/notifications/${currentUser &&
                  currentUser._id.toString()}`}
                className="navigation__link"
              >
                <i
                  className={
                    notifications && notifications.count > 0
                      ? "fas fa-bell notification-alert"
                      : "fas fa-bell"
                  }
                >
                  {notifications && notifications.count > 0 ? (
                    <div className="notification-count">
                      {notifications.count}
                    </div>
                  ) : null}
                </i>
              </Link>
            </li>
            <div
              onClick={this.toggleDropdown}
              className="navigation__settings-dropdown"
            >
              <i className="fas fa-caret-down"></i>

              {dropdown}
            </div>
          </div>
        </div>
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token
});

const actions = {
  searchUser
};

export default connect(mapStateToProps, actions)(DesktopNavigation);
