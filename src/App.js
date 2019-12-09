import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "./css/styles.css";
import { connect } from "react-redux";
import { setAuth, setUserId, setToken } from "./controllers/auth";
import {
  getUser,
  getPosts,
  getNotifications,
  getMessages,
  getFriendRequests
} from "./controllers/user";
import { modifyPosts, modifyPost, removePost } from "./controllers/post";
import openSocket from "socket.io-client";

// Components
import MainPage from "./views/main-page/MainPage";
import Comments from "./views/feed/posts/comments/Comments";
import Register from "./views/auth/register/Register";
import Login from "./views/auth/login/Login";
import ForgotPassword from "./views/auth/password-reset/ForgotPassword";
import PasswordReset from "./views/auth/password-reset/PasswordReset";
import Settings from "./views//profile/Settings";
import Navigation from "./views/navigation/Navigation";
import ProfilePage from "./views/profile/ProfilePage";
import PostStatus from "./views/status/PostStatus";
import EditPrivacy from "./views/feed/posts/edit-post/EditPrivacy";
import EditPost from "./views/feed/posts/edit-post/EditPost";
import Modal from "./components/Modal";
import Notifications from "./views/notifications/Notifications";
import FriendRequests from "./views/friend-requests/FriendRequests";
import FriendSearch from "./views/friend-search/FriendSearch";
import Messaging from "./views/messaging/Messaging";
import Message from "./components/Message";
import MessagingDisplay from "./views/messaging/MessagingDisplay";
import UpdateProfile from "./views/profile/UpdateProfile";
import ProfileFriends from "./views/profile/ProfileFriends";

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem("token"),
      userId = localStorage.getItem("userId");

    const {
      setAuth,
      setUserId,
      setToken,
      getUser,
      getPosts,
      modifyPosts,
      modifyPost,
      getNotifications,
      getMessages,
      removePost,
      getFriendRequests
    } = this.props;

    // Load posts for feed
    getPosts(token, userId);

    if (!token) {
      return;
    }

    setAuth(true);
    setUserId(userId);
    setToken(token);
    getUser(userId);

    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("notification", data => {
      getNotifications(userId, token);
      getMessages(userId, token);
      getFriendRequests(token);
    });

    socket.on("posts", data => {
      switch (data.action) {
        case "update":
          getPosts(token, userId);
          return;

        case "delete post":
          removePost(data.postId);
          return;

        case "post like":
        case "remove post like":
          modifyPosts(data.post);
          modifyPost(data.post);
          return;

        case "edit privacy":
          modifyPost(null, data.postData);
          return;

        case "add comment like":
        case "remove comment like":
        case "add reply like":
        case "remove reply like":
          modifyPost(data.post);
          return;

        default:
          return;
      }
    });
  }

  render() {
    const { isAuth } = this.props;

    return (
      <Router>
        <Modal />
        <div className="main-wrapper">
          <Navigation isAuth={isAuth} />
          <Switch>
            {!isAuth ? (
              <React.Fragment>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />

                <Route
                  exact
                  path="/profile/friends/:userId"
                  component={ProfileFriends}
                />

                <Route
                  exact
                  path="/forgot-password"
                  component={ForgotPassword}
                />
                <Route
                  exact
                  path="/password-reset/:resetToken"
                  component={PasswordReset}
                />
                <Route
                  exact
                  path="/"
                  component={props => <MainPage {...props} />}
                />
                <Route exact path="/comment/:postId" component={Comments} />

                <Route exact path="/profile/:userId" component={ProfilePage} />
                <Redirect to="/" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Route
                  exact
                  path="/"
                  component={props => <MainPage {...props} />}
                />

                <Route
                  exact
                  path="/profile/friends/:userId"
                  component={ProfileFriends}
                />

                <Route exact path="/comment/:postId" component={Comments} />

                <Route exact path="/settings" component={Settings} />

                <Route exact path="/status/:userId" component={PostStatus} />

                <Route exact path="/profile/:userId" component={ProfilePage} />

                <Route
                  exact
                  path="/edit-privacy/:postId"
                  component={EditPrivacy}
                />

                <Route exact path="/edit-post/:postId" component={EditPost} />

                <Route
                  exact
                  path="/notifications/:userId"
                  component={Notifications}
                />

                <Route
                  exact
                  path="/friend-requests/:userId"
                  component={FriendRequests}
                />

                <Route exact path="/search" component={FriendSearch} />

                <Route exact path="/messaging/:userId" component={Messaging} />

                <Route
                  exact
                  path="/message-single/:userId"
                  component={props => (
                    <Message navTitle="New Message" type="single" {...props} />
                  )}
                />

                <Route
                  exact
                  path="/message/:messageId"
                  component={props => (
                    <MessagingDisplay type="mobile" {...props} />
                  )}
                />

                <Route
                  exact
                  path="/update-profile/:userId"
                  component={UpdateProfile}
                />

                <Redirect to="/" />
              </React.Fragment>
            )}
          </Switch>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  userId: state.auth.userId
});

const actions = {
  setAuth,
  setUserId,
  setToken,
  getUser,
  getPosts,
  modifyPosts,
  modifyPost,
  getNotifications,
  removePost,
  getMessages,
  getFriendRequests
};

export default connect(mapStateToProps, actions)(App);
