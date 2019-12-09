import React, { Component } from "react";
import SecondaryNavigation from "../views/navigation/SecondaryNavigation";
import TextInput from "../common/form/TextInput";
import TextArea from "../common/form/TextArea";
import Loading from "../common/helpers/Loading";
import { sendMessage } from "../controllers/user";
import { alert } from "../controllers/alert";
import { ERROR } from "../redux/reducers/alert/AlertConstants";
import { connect } from "react-redux";

class Message extends Component {
  state = {
    singleFriend: "",
    selectedFriend: null,
    message: "",
    friends: [],
    friendResults: []
  };

  componentDidMount() {
    const { currentUser, selectedUser } = this.props;

    if (selectedUser) {
      this.setState({ selectedFriend: selectedUser });
    }

    if (currentUser) {
      this.setState({ friends: currentUser.friends });
    }
  }

  onChange = e => {
    const value = e.target.value;

    const { friends } = this.state;

    this.setState({ [e.target.name]: value });

    if (e.target.name !== "message") {
      const regex = new RegExp([value], "i");

      const result = friends.filter(friend => regex.test(friend.fullName));

      this.setState({ friendResults: result });
    }
  };

  sendMessage = e => {
    e.preventDefault();
    const { type, userId, token, sendMessage, alert } = this.props;
    const { selectedFriend, message } = this.state;

    // Check if there is a selectedFriend
    if (!selectedFriend) {
      return alert(ERROR, {
        type: "error",
        message: "A user must be selected to send a message"
      });
    }

    sendMessage(
      userId,
      selectedFriend.friendId,
      message,
      token,
      type,
      this.props
    );
  };

  selectUser = (friendId, name) => {
    const friendData = {
      friendId,
      name
    };

    this.setState({
      selectedFriend: friendData,
      singleFriend: "",
      friendResults: []
    });
  };

  clearSelectedFriend = () => {
    this.setState({ selectedFriend: null });
  };

  render() {
    const { navTitle, type, message, alertData, loading, userId } = this.props;
    const { singleFriend, friendResults, selectedFriend } = this.state;

    let display, alertDiv;

    if (alertData && alertData.message) {
      alertDiv = (
        <div
          className={
            alertData.type === "success"
              ? "alert alert--success"
              : "alert alert--error"
          }
        >
          {alertData.message}
        </div>
      );
    }

    if (type === "single") {
      display = (
        <React.Fragment>
          {alertDiv}
          <div className="message__to">
            <span>To:</span>

            <TextInput
              type="text"
              name="singleFriend"
              value={singleFriend}
              onChange={this.onChange}
              className="message__input"
              disabled={selectedFriend}
            />

            {selectedFriend ? (
              <div
                onClick={this.clearSelectedFriend}
                className="message__selected-friend"
              >
                {selectedFriend.name}
              </div>
            ) : null}
          </div>

          <div className="message__compose">
            <form onSubmit={this.sendMessage}>
              <TextArea
                placeholder="Write a message..."
                name="message"
                value={message}
                onChange={this.onChange}
                classname="message__compose-input"
              />
              <div className="message__compose-footer">
                <button
                  className={
                    loading.value &&
                    loading.userId === userId &&
                    loading.type === "send message"
                      ? "btn btn--send-message dark-overlay text-grey flex"
                      : "btn btn--send-message"
                  }
                  type="submit"
                >
                  {loading.value &&
                  loading.type === "send message" &&
                  loading.userId === userId ? (
                    <Loading />
                  ) : null}{" "}
                  Send
                </button>
              </div>
            </form>

            {friendResults.length > 0 ? (
              <ul className="message__results-list">
                {friendResults.map(friend => (
                  <li
                    onClick={() =>
                      this.selectUser(friend._id.toString(), friend.fullName)
                    }
                    className="message__results-item"
                  >
                    <div className="user-image">
                      <img
                        className="profile-img"
                        src={friend.profileImage.imageUrl}
                        alt="profile"
                      />
                    </div>
                    <p>{friend.fullName}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <SecondaryNavigation navTitle={navTitle} />
        <section className="message">{display}</section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  alertData: state.alert.alert,
  errors: state.errors.error,
  userId: state.auth.userId,
  token: state.auth.token,
  loading: state.loading.loading,
  selectedUser: state.chat.selectedUser
});

const actions = {
  sendMessage,
  alert
};

export default connect(mapStateToProps, actions)(Message);
