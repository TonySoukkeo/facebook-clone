import React, { Component } from "react";
import { handleFriendRequest } from "../../controllers/user";
import { connect } from "react-redux";
import Moment from "react-moment";
import openSocket from "socket.io-client";
import { getFriendRequests } from "../../controllers/user";
import Loading from "../../common/helpers/Loading";
import { Link } from "react-router-dom";
import FriendSidebar from "../../components/FriendSidebar";

class FriendRequests extends Component {
  state = {
    selectRequest: null,
    windowWidth: null
  };

  componentDidMount() {
    const { token, getFriendRequests } = this.props;
    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    socket.on("notification", data => {
      getFriendRequests(token);
    });
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  handleRequest = (requestId, type, friendId = null) => {
    const { handleFriendRequest, currentUser, token } = this.props;

    this.setState({ selectRequest: friendId });

    handleFriendRequest(
      currentUser._id.toString(),
      requestId,
      token,
      friendId,
      type
    );
  };

  render() {
    const { friendRequest, loading, userId } = this.props;
    const { selectRequest, windowWidth } = this.state;

    let display;

    if (friendRequest && friendRequest.content.length > 0) {
      display = (
        <div className="friend-requests__content">
          {friendRequest.content.map(item => (
            <ul key={item._id.toString()} className="friend-requests__list">
              <li className="friend-requests__item">
                <div>
                  <Link
                    to={`/profile/${item.user._id.toString()}`}
                    className="user-image user-image--lg"
                  >
                    <img
                      src={item.user.profileImage.imageUrl}
                      alt="Profile"
                      className="profile-img"
                    />
                  </Link>
                </div>
                <div className="flex flex--column ml-sm">
                  <div className="friend-requests--title">
                    <Link
                      to={`/profile/${item.user._id.toString()}`}
                      className="friend-requests__item-name"
                    >
                      {`${item.user.firstName} ${item.user.lastName}`}
                    </Link>

                    <div className="friend-requests__item-timestamp">
                      <Moment fromNow ago>
                        {item.date}
                      </Moment>
                    </div>
                  </div>

                  <div className="friend-requests--action">
                    <button
                      onClick={() =>
                        this.handleRequest(
                          item._id.toString(),
                          "accept",
                          item.user._id.toString()
                        )
                      }
                      className="btn btn--blue"
                    >
                      {loading.value &&
                      loading.userId === userId &&
                      loading.type === "accept request" &&
                      selectRequest === item.user._id.toString() ? (
                        <Loading />
                      ) : (
                        "Confirm"
                      )}
                    </button>
                    <button
                      onClick={() =>
                        this.handleRequest(item._id.toString(), "decline")
                      }
                      className="btn btn--light"
                    >
                      {loading.value &&
                      loading.userId === userId &&
                      loading.type === "decline request" &&
                      selectRequest === item.user._id.toString() ? (
                        <Loading />
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          ))}
        </div>
      );
    } else {
      display = (
        <div className="text-center mt-sm friend-requests__content">
          No requests
        </div>
      );
    }

    return (
      <section className="friend-requests grid">
        {windowWidth > 790 ? <FriendSidebar /> : null}

        <div className="friend-requests__header">
          <h2>Friend Requests</h2>
        </div>
        {display}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token,
  friendRequest: state.user.friendRequest,
  loading: state.loading.loading,
  userId: state.auth.userId
});

const actions = {
  handleFriendRequest,
  getFriendRequests
};

export default connect(mapStateToProps, actions)(FriendRequests);
