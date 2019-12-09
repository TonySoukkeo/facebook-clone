import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getNotifications,
  clearNotifications,
  resetFriendRequest,
  getMessages,
  getFriendRequests,
  clearMessageCount,
  getUser
} from "../../controllers/user";
import openSocket from "socket.io-client";
import MobileNavigation from "./Components/MobileNavigation";
import DesktopNavigation from "./Components/DesktopNavigation";

class Navigation extends Component {
  state = {
    windowWidth: null
  };

  componentDidMount() {
    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    this.updateWindowDimensions();

    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    socket.on("notification", data => {
      this.subscribe();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentUser !== prevProps.currentUser) {
      const {
        getNotifications,
        token,
        userId,
        getMessages,
        getFriendRequests
      } = this.props;

      getFriendRequests(token);
      getNotifications(userId, token);
      getMessages(userId, token);
    }
  }

  updateWindowDimensions() {
    this.setState({ windowWidth: window.innerWidth });
  }

  subscribe = () => {
    const { userId, token, getNotifications, getMessages } = this.props;

    getNotifications(userId, token);
    getMessages(userId, token);
    getFriendRequests(token);
  };

  clearNotifications = () => {
    const { currentUser, token, clearNotifications } = this.props;
    if (currentUser) {
      clearNotifications(currentUser._id.toString(), token, "reset");
    }
  };

  clearFriendRequest = () => {
    const { currentUser, token, resetFriendRequest } = this.props;
    if (currentUser) {
      resetFriendRequest(currentUser._id.toString(), token);
    }
  };

  clearMessageCount = () => {
    const { token, clearMessageCount } = this.props;

    clearMessageCount(token);
  };

  render() {
    const {
      isAuth,
      notifications,
      currentUser,
      messages,
      friendRequest
    } = this.props;

    const { windowWidth } = this.state;
    let navigation;

    if (isAuth) {
      navigation =
        windowWidth < 790 ? (
          <MobileNavigation
            clearFriendRequest={this.clearFriendRequest}
            currentUser={currentUser}
            friendRequest={friendRequest}
            clearMessageCount={this.clearMessageCount}
            clearNotifications={this.clearNotifications}
            messages={messages}
            notifications={notifications}
          />
        ) : (
          <DesktopNavigation
            friendRequest={friendRequest}
            clearFriendRequest={this.clearFriendRequest}
            notifications={notifications}
            messages={messages}
            clearMessageCount={this.clearMessageCount}
            clearNotifications={this.clearNotifications}
          />
        );
    } else {
      navigation = (
        <ul className="navigation__list">
          <li className="navigation__item navigation__logo">
            <Link to="/" className="navigation__link navigation__link--logo">
              facebook
            </Link>
          </li>
          <li className="navigation__login">
            <Link to="/login" className="navigation__link">
              Login
            </Link>
          </li>
          <li className="navigation__register">
            <Link to="/register" className="navigation__link">
              Register
            </Link>
          </li>
        </ul>
      );
    }
    return <nav className="navigation">{navigation}</nav>;
  }
}

const mapStateToProps = state => ({
  notifications: state.user.notifications,
  messages: state.user.messages,
  currentUser: state.user.currentUser,
  token: state.auth.token,
  userId: state.auth.userId,
  friendRequest: state.user.friendRequest
});

const actions = {
  getNotifications,
  clearNotifications,
  clearMessageCount,
  resetFriendRequest,
  getMessages,
  getUser,
  getFriendRequests
};

export default connect(mapStateToProps, actions)(Navigation);
