import React, { Component } from "react";
import SecondaryNavigation from "../../views/navigation/SecondaryNavigation";
import { sendFriendRequest, cancelFriendRequest } from "../../controllers/user";
import openSocket from "socket.io-client";
import Loading from "../../common/helpers/Loading";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ProfileFriends extends Component {
  state = {
    user: null
  };
  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;

    const userId = this.props.match.params.userId;

    const user = await fetch(
      `${process.env.REACT_APP_API_URI}/profile/timeline/${userId}`
    ).then(async res => await res.json());

    if (this._isMounted) {
      this.setState({ user });
    }

    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("notification", async data => {
      const user = await fetch(
        `${process.env.REACT_APP_API_URI}/profile/timeline/${userId}`
      ).then(async res => await res.json());

      if (this._isMounted) {
        this.setState({ user });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  sendFriendRequest = friendId => {
    const { token, sendFriendRequest, userId } = this.props;

    sendFriendRequest(userId, friendId, token);
  };

  cancelFriendRequest = friendId => {
    const { token, cancelFriendRequest } = this.props;

    cancelFriendRequest(friendId, token);
  };

  render() {
    const { user } = this.state;
    const { currentUser, loading, userId } = this.props;

    let friendsDisplay;

    if (user && user.friends.length > 0) {
      friendsDisplay = (
        <ul className="friend-requests__list">
          {currentUser &&
            user.friends.map(friend => {
              const isFriends = currentUser.friends.filter(
                user => user._id === friend._id
              );

              const requestSent = friend.requests.content.filter(
                req => req.user === currentUser._id
              );

              return (
                <li key={friend._id} className="friend-requests__item">
                  <div>
                    <Link
                      to={`/profile/${friend._id}`}
                      className="user-image user-image--lg"
                    >
                      <img
                        src={friend.profileImage.imageUrl}
                        alt="Profile"
                        className="profile-img"
                      />
                    </Link>
                  </div>

                  <div className="flex flex--column ml-sm">
                    <div className="friend-requests--title">
                      <Link
                        to={`/profile/${friend._id}`}
                        className="friend-requests__item-name"
                      >
                        {friend.fullName}
                      </Link>
                    </div>

                    <div className="friend-requests--action">
                      {friend._id ===
                      currentUser._id ? null : requestSent.length > 0 ? (
                        <div className="profile-friends__request-sent">
                          <p>Request Sent</p>
                          <button
                            onClick={() => this.cancelFriendRequest(friend._id)}
                            className="profile-friends__request-cancel"
                          >
                            {loading.value &&
                            loading.type === "cancel request" &&
                            loading.userId === userId ? (
                              <Loading />
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        </div>
                      ) : isFriends.length > 0 ? (
                        <div className="profile-friends__btn profile-friends__btn--friends">
                          {" "}
                          Friends{" "}
                        </div>
                      ) : (
                        <div
                          onClick={() => this.sendFriendRequest(friend._id)}
                          className="profile-friends__btn profile-friends__btn--add-friend"
                        >
                          {loading.value &&
                          loading.type === "send request" &&
                          loading.userId === userId ? (
                            <Loading />
                          ) : (
                            "Add Friend"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      );
    }

    return (
      <React.Fragment>
        <SecondaryNavigation
          navTitle={user && `${user.firstName} ${user.lastName}`}
        />
        <section className="profile-friends">
          <div className="profile-friends__header">Friends</div>
          {friendsDisplay}
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token,
  userId: state.auth.userId,
  loading: state.loading.loading
});

const actions = {
  sendFriendRequest,
  cancelFriendRequest
};

export default connect(mapStateToProps, actions)(ProfileFriends);
