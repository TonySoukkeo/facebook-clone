import React, { Component } from "react";
import {
  searchUser,
  sendFriendRequest,
  cancelFriendRequest
} from "../controllers/user";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "../common/form/TextInput";

class SearchInput extends Component {
  state = {
    search: "",
    users: []
  };

  onChange = async e => {
    const value = e.target.value;
    const { searchUser, token, userId } = this.props;

    this.setState({ [e.target.name]: value });

    const users = await searchUser(this.state.search, token, userId);

    this.setState({ users });
  };

  sendFriendRequest = async friendId => {
    const { currentUser, sendFriendRequest, token } = this.props;

    const friend = await sendFriendRequest(
      currentUser._id.toString(),
      friendId,
      token
    );

    this.updateUserState(friend);
  };

  cancelRequest = async friendId => {
    const { cancelFriendRequest, token, userId } = this.props;

    const friend = await cancelFriendRequest(friendId, token, userId);

    this.updateUserState(friend);
  };

  updateUserState = friend => {
    const { users } = this.state;

    const friendIndex = users.findIndex(user => user._id === friend._id);

    users[friendIndex] = friend;

    this.setState({ users });
  };

  render() {
    const { search, users } = this.state;
    const { currentUser } = this.props;

    let searchDisplay;

    if (currentUser && users.length > 0) {
      searchDisplay = (
        <ul className="search__list">
          <div className="search__list-header">
            <p>People</p>
          </div>
          {users.map(user => {
            const alreadyFriends = currentUser.friends.filter(
              item => item._id === user._id
            );

            const hasPendingRequest = user.requests.content.filter(
              req => req.user === currentUser._id
            );

            return (
              <li key={user._id} className="search__item">
                <Link
                  to={`/profile/${user._id.toString()}`}
                  className="user-image user-image--md"
                >
                  <img
                    className="profile-img"
                    src={user.profileImage.imageUrl}
                    alt="Profile"
                  />
                </Link>
                <Link
                  to={`/profile/${user._id.toString()}`}
                  className="search__item-name"
                >
                  {user.fullName}
                </Link>
                {currentUser._id ===
                user._id ? null : hasPendingRequest.length > 0 ? (
                  <div
                    onClick={() => this.cancelRequest(user._id)}
                    className="search__item-add search__item-add--friend"
                  >
                    <p>Request sent</p>
                  </div>
                ) : alreadyFriends.length !== 1 ? (
                  <div
                    onClick={() => this.sendFriendRequest(user._id)}
                    className="search__item-add"
                  >
                    <i className="fas fa-user-plus"></i>
                  </div>
                ) : (
                  <div className="search__item-add search__item-add--friend">
                    <i className="fas fa-user-check"></i>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <div className="search">
        <div className="search__input-container">
          <i className="fas fa-search"></i>
          <TextInput
            type="text"
            name="search"
            value={search}
            onChange={this.onChange}
            placeholder="Search"
            className="search__input"
          />
        </div>
        <div className="container">{searchDisplay}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  currentUser: state.user.currentUser,
  userId: state.auth.userId
});

const actions = {
  searchUser,
  sendFriendRequest,
  cancelFriendRequest
};

export default connect(mapStateToProps, actions)(SearchInput);
