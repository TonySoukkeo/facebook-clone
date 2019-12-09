import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { selectUser } from "../controllers/chat";
import { getUser } from "../controllers/user";
import openSocket from "socket.io-client";

class FriendSidebar extends Component {
  componentDidMount() {
    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("handle friend", data => {
      switch (data.action) {
        case "accept request":
        case "remove friend":
          this.subscribe(data.id);
          return;

        default:
          return;
      }
    });
  }

  subscribe = id => {
    const { getUser, userId } = this.props;

    if (id.includes(userId)) {
      getUser(userId);
    }
  };

  sendMessage = (friendId, firstName, lastName) => {
    const { selectUser } = this.props;

    const friendData = {
      friendId,
      name: `${firstName} ${lastName}`
    };

    selectUser(friendData);
  };

  render() {
    const { currentUser, isAuth } = this.props;

    let display, friends;

    if (currentUser) {
      if (currentUser.friends.length > 12) {
        friends = currentUser.friends.slice(0, 12);
      } else {
        friends = currentUser.friends;
      }

      display = (
        <ul className="friend-sidebar__list">
          {friends.length > 0 ? (
            friends.map(friend => (
              <Link
                key={friend._id}
                to={`/message-single/${currentUser._id}`}
                onClick={() =>
                  this.sendMessage(
                    friend._id,
                    friend.firstName,
                    friend.lastName
                  )
                }
                className="friend-sidebar__item"
              >
                <div className="user-image">
                  <img
                    src={friend.profileImage.imageUrl}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>
                {friend.fullName}
              </Link>
            ))
          ) : (
            <div className="friend-sidebar__no-friends container">
              <p>No current friends</p>
              <Link to="/search" className="friend-sidebar__no-friends--search">
                Search for friends
              </Link>
            </div>
          )}
          {friends.length > 0 ? (
            <Link
              to={`/profile/friends/${currentUser._id}`}
              className="friend-sidebar__btn"
            >
              View all friends
            </Link>
          ) : null}
        </ul>
      );
    }

    return (
      <div className="friend-sidebar">
        <div className="container">
          <h2>Contacts</h2>
        </div>
        {isAuth ? (
          display
        ) : (
          <div className="friend-sidebar__guest">
            <i className="fas fa-users"></i>
            <p>Must be logged in to view friends</p>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  isAuth: state.auth.isAuth,
  userId: state.auth.userId
});

const actions = {
  selectUser,
  getUser
};

export default connect(mapStateToProps, actions)(FriendSidebar);
