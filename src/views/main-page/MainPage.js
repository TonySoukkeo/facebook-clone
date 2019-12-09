import React, { Component } from "react";
import Feed from "../feed/Feed";
import Status from "../status/Status";
import { connect } from "react-redux";
import openSocket from "socket.io-client";
import { getPosts } from "../../controllers/user";
import PostStatus from "../../views/status/PostStatus";
import ProfileSideBar from "../../components/ProfileSideBar";
import FriendSidebar from "../../components/FriendSidebar";

class MainPage extends Component {
  state = {
    windowWidth: null
  };

  componentDidMount() {
    const { token, getPosts, userId } = this.props;

    this.updateWindowDimensions();

    window.addEventListener("resize", this.updateWindowDimensions.bind(this));

    if (token) {
      const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

      socket.on("posts", data => {
        switch (data.action) {
          case "create post":
            getPosts(token, userId);
            return;

          default:
            return;
        }
      });
    }
  }

  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  render() {
    const { currentUser, isAuth } = this.props;

    const { windowWidth } = this.state;

    return (
      <section className="main-page">
        {currentUser ? <Status currentUser={currentUser} /> : null}

        {isAuth && currentUser && windowWidth > 790 ? (
          <PostStatus {...this.props} className="mb-sm" />
        ) : null}

        {windowWidth > 790 ? <ProfileSideBar /> : null}

        {windowWidth > 790 ? <FriendSidebar /> : null}
        <Feed />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token,
  isAuth: state.auth.isAuth,
  userId: state.user.userId
});

const actions = {
  getPosts
};

export default connect(mapStateToProps, actions)(MainPage);
