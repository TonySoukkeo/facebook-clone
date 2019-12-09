import React, { Component } from "react";
import Status from "../status/Status";
import Posts from "../feed/posts/Posts";
import SecondaryNavigation from "../navigation/SecondaryNavigation";
import {
  sendFriendRequest,
  removeFriend,
  cancelFriendRequest
} from "../../controllers/user";
import { selectUser } from "../../controllers/chat";
import { deletePost } from "../../controllers/post";
import { connect } from "react-redux";
import openSocket from "socket.io-client";
import FriendSidebar from "../../components/FriendSidebar";
import Banner from "./profile-components/Banner";
import MobileToolbar from "./profile-components/MobileToolbar";
import Friends from "./profile-components/Friends";

class ProfilePage extends Component {
  state = {
    profile: false,
    banner: false,
    user: null,
    toggleFriendOption: false,
    windowWidth: null
  };

  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;

    const userId = this.props.match.params.userId;

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));

    // Fetch user profile details
    const user = await fetch(
      `${process.env.REACT_APP_API_URI}/profile/timeline/${userId}`
    ).then(async res => await res.json());

    if (this._isMounted) {
      this.setState({ user });
    }

    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("friend", async data => {
      const user = await fetch(
        `${process.env.REACT_APP_API_URI}/profile/timeline/${userId}`
      ).then(async res => await res.json());

      if (this._isMounted) {
        this.setState({ user });
      }
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    this._isMounted = true;
    const userId = this.props.match.params.userId;

    if (this.props !== prevProps) {
      // Fetch user profile details
      const user = await fetch(
        `${process.env.REACT_APP_API_URI}/profile/timeline/${userId}`
      ).then(async res => await res.json());

      if (this._isMounted) {
        this.setState({ user });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  imageUpload = async e => {
    const { profile } = this.state;
    const { userId, token } = this.props;

    // Check type of image ie: profile or banner image

    const formData = new FormData();

    formData.append("image", e.target.files[0]);
    formData.append("userId", userId);

    if (profile) {
      formData.append("type", "profile");
    } else {
      formData.append("type", "banner");
    }

    const changeImage = await fetch(
      `${process.env.REACT_APP_API_URI}/profile/image`,
      {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Reset state
    this.setState({ profile: false, banner: false, user: changeImage.user });
  };

  selectImageType = type => {
    switch (type) {
      case "banner":
        this.setState({ profile: false, banner: true });
        break;

      case "profile":
        this.setState({ profile: true, banner: false });
        break;

      default:
        return;
    }
  };

  addFriend = () => {
    const friendId = this.props.match.params.userId;
    const { userId, token, sendFriendRequest } = this.props;

    sendFriendRequest(userId, friendId, token);
  };

  cancelRequest = () => {
    const friendId = this.props.match.params.userId;
    const { token, userId, cancelFriendRequest } = this.props;

    cancelFriendRequest(friendId, token, userId);
  };

  toggleFriendOption = () => {
    const { toggleFriendOption } = this.state;
    this.setState({ toggleFriendOption: !toggleFriendOption });
  };

  removeFriend = () => {
    const friendId = this.props.match.params.userId;

    const { removeFriend, token, userId } = this.props;

    removeFriend(friendId, token, userId);

    this.setState({ toggleFriendOption: false });
  };

  sendMessage = () => {
    const friendId = this.props.match.params.userId;

    const { user } = this.state;
    const { selectUser } = this.props;

    const friendData = {
      friendId,
      name: `${user.firstName} ${user.lastName}`
    };

    selectUser(friendData);
  };

  updateWindowDimensions = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  render() {
    const { user, toggleFriendOption, windowWidth } = this.state;
    const { userId, loading, token, deletePost, currentUser } = this.props;

    const profilePageUserId = this.props.match.params.userId;

    let isFriends = false,
      postsDisplay,
      horizontalLine,
      friends,
      pendingRequest;

    if (windowWidth < 790) {
      horizontalLine = <div className="horizontal-line"></div>;
    }

    if (user) {
      // Get the first 9 friends from user
      if (user.friends.length > 9) {
        friends = user.friends.slice(0, 9);
      } else {
        friends = user.friends;
      }

      postsDisplay = (
        <div className="profile-page__posts">
          <Status />

          {/*** Posts ***/}

          {user && user.posts.length > 0 ? (
            user.posts.map(post => (
              <Posts
                key={post._id}
                fullName={post.creator.fullName}
                timestamp={post.createdAt}
                privacy={post.privacy}
                postContent={post.content}
                postImage={post.postImage}
                likes={post.likes}
                profileImage={post.creator.profileImage.imageUrl}
                comments={post.comments}
                id={post._id.toString()}
                creatorId={post.creator._id.toString()}
                userId={userId}
                token={token}
                deletePostCB={deletePost}
                loading={loading}
              />
            ))
          ) : (
            <div className="text-center">No posts to show</div>
          )}
        </div>
      );
    }

    if (user && currentUser) {
      // Check on current profile user to see if they are already friends
      user.friends.forEach(friend => {
        if (friend._id === currentUser._id) {
          isFriends = true;
        }
      });

      // Check on current profile if user has a pending request
      user.requests.content.forEach(item => {
        if (item.user === currentUser._id) {
          pendingRequest = true;
        }
      });
    }

    return (
      <React.Fragment>
        {windowWidth < 790 ? (
          <SecondaryNavigation navTitle="Tony Soukkeo" />
        ) : null}

        <section className="profile-page">
          <div
            className={
              windowWidth < 790
                ? "container background-white profile-page__grid"
                : "profile-page__grid"
            }
          >
            {/*** FriendSidebar ***/}
            {windowWidth > 790 ? <FriendSidebar /> : null}

            {/*** Banner ***/}
            <Banner
              user={user}
              profilePageUserId={profilePageUserId}
              imageUpload={this.imageUpload}
              selectImageType={this.selectImageType}
              userId={userId && userId}
              windowWidth={windowWidth}
              isFriends={isFriends}
              addFriend={this.addFriend}
              removeFriend={this.removeFriend}
              pendingRequest={pendingRequest}
              cancelRequest={this.cancelRequest}
              loading={loading}
            />
            {/**** Inner grid ****/}
            <div
              className={windowWidth > 790 ? "profile-page__inner-grid" : null}
            >
              {/*** Toolbar ***/}
              {windowWidth < 790 ? (
                <MobileToolbar
                  userId={userId && userId}
                  profilePageUserId={profilePageUserId}
                  isFriends={isFriends}
                  addFriend={this.addFriend}
                  onClickToggleFriendOption={this.toggleFriendOption}
                  toggleFriendOption={toggleFriendOption}
                  removeFriend={this.removeFriend}
                  sendMessage={this.sendMessage}
                  loading={loading}
                  pendingRequest={pendingRequest}
                  cancelRequest={this.cancelRequest}
                />
              ) : null}

              <div className="profile-page__details-sidebar">
                {/*** Details ***/}
                <div className="profile-page__details">
                  <ul className="profile-page__details-list">
                    <li className="profile-page__details-item">
                      <span>
                        <i className="fas fa-briefcase"></i>
                      </span>
                      <p>{user && user.details.occupation}</p>
                    </li>
                  </ul>
                </div>

                {/**** Horizontal line ***/}
                {horizontalLine}

                {/*** Friends ***/}
                <Friends
                  windowWidth={windowWidth}
                  user={user}
                  friends={friends}
                  profilePageUserId={profilePageUserId}
                />

                {horizontalLine}
              </div>

              {/*** Post ***/}
              <h3 className="profile-page__friends-title">Posts</h3>

              {/*** Posts display desktop ***/}
              {windowWidth > 790 ? postsDisplay : null}
            </div>
          </div>

          {/*** Posts display Mobile ***/}
          {windowWidth < 790 ? postsDisplay : null}
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  token: state.auth.token,
  loading: state.loading.loading,
  currentUser: state.user.currentUser
});

const actions = {
  deletePost,
  sendFriendRequest,
  cancelFriendRequest,
  removeFriend,
  selectUser
};

export default connect(mapStateToProps, actions)(ProfilePage);
