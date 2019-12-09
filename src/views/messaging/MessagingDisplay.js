import React, { Component } from "react";
import {
  getChat,
  createMessage,
  leaveChat,
  addUserToChat
} from "../../controllers/user";
import TextArea from "../../common/form/TextArea";
import Moment from "react-moment";
import { connect } from "react-redux";
import AddFriendModal from "../../components/AddFriendModal";
import ViewUsersModal from "../../components/ViewUsersModal";
import openSocket from "socket.io-client";
import { Link } from "react-router-dom";
import Loading from "../../common/helpers/Loading";

class MessagingDisplay extends Component {
  state = {
    friends: [],
    message: "",
    toggleOptions: false,
    toggleModal: false,
    toggleViewUsers: false,
    windowWidth: null
  };

  componentDidMount() {
    const chatId = this.props.match.params.messageId;

    const { token, getChat, currentUser } = this.props;

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    getChat(chatId, token, this.props, currentUser._id);

    this.setState({ friends: currentUser.friends });

    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("messages", data => {
      if (data.chatId === chatId) {
        switch (data.action) {
          case "send message":
          case "leave chat":
          case "add user":
            getChat(chatId, token, this.props, currentUser._id);
            return;

          default:
            return;
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.chat !== prevProps.chat) {
      this.scrollToBottom();
    }
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  chatOptions = () => {
    const { toggleOptions } = this.state;
    this.setState({ toggleOptions: !toggleOptions });
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  sendMessage = e => {
    e.preventDefault();
    const {
      token,
      createMessage,
      chat,
      loading,
      alertData,
      userId
    } = this.props;
    const { message } = this.state;

    const recipients = chat.users.map(user => user.userId._id);

    createMessage(recipients, message, token, userId);

    // Clear message input
    if (!loading.value && !alertData) {
      this.setState({ message: "" });
    }
  };

  leaveChat = () => {
    const chatId = this.props.match.params.messageId;
    const { userId, chat, token, leaveChat } = this.props;

    // Get currentUser chatId to remove from database
    const userItemId = chat.users.filter(item => item.userId._id === userId)[0]
      ._id;

    leaveChat(chatId, userItemId, token, this.props, userId);
  };

  toggleModal = () => {
    const { toggleModal } = this.state;
    this.setState({ toggleModal: !toggleModal, toggleOptions: false });
  };

  toggleUserViews = () => {
    const { toggleViewUsers } = this.state;

    this.setState({ toggleViewUsers: !toggleViewUsers });
  };

  addUser = friendId => {
    const chatId = this.props.match.params.messageId;

    const { token, addUserToChat, userId } = this.props;

    addUserToChat(friendId, chatId, token, userId);

    this.setState({ toggleModal: false });
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    const { chat, userId, alertData, loading } = this.props;
    const {
      message,
      toggleOptions,
      toggleModal,
      friends,
      toggleViewUsers,
      windowWidth
    } = this.state;

    let chatDisplay, headerDisplay, alertDiv, chatSidebar;

    if (windowWidth > 790 && chat) {
      chatSidebar = (
        <ul className="messaging-display__sidebar">
          <div className="messaging-display__sidebar-header">
            <p>Users in chat</p>
          </div>
          <div className="container">
            {chat.users.map(user => (
              <Link
                key={user.userId._id}
                to={`/profile/${user.userId._id}`}
                className="messaging-display__sidebar-item"
              >
                <div className="user-image">
                  <img
                    src={user.userId.profileImage.imageUrl}
                    alt="User"
                    className="profile-img"
                  />
                </div>
                <p>{user.userId.fullName}</p>
              </Link>
            ))}
          </div>
        </ul>
      );
    }

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

    if (chat) {
      // Filter out current user from array
      const participants = chat.users.filter(
        user => user.userId._id !== userId
      );

      headerDisplay = (
        <div className="messaging-display__header">
          {chat.users.length === 2 ? (
            <Link
              to={`/profile/${participants[0].userId._id}`}
              className="messaging-display__header-name"
            >
              {participants[0].userId.fullName}
            </Link>
          ) : chat.users.length > 2 ? (
            <div
              onClick={this.toggleUserViews}
              className="messaging-display__header-multiple"
            >
              {chat.users.length} People
            </div>
          ) : (
            <span
              onClick={this.toggleModal}
              className="messaging-display__header-add"
            >
              <i className="fas fa-plus"></i> Add user
            </span>
          )}

          <i onClick={this.chatOptions} className="fas fa-share-square"></i>

          {toggleOptions ? (
            <ul className="messaging-display__header-list">
              <li
                onClick={this.toggleModal}
                className="messaging-display__header-item"
              >
                Add user
              </li>
              <li
                onClick={this.leaveChat}
                className="messaging-display__header-item"
              >
                Leave chat
              </li>
            </ul>
          ) : null}
        </div>
      );
    }

    if (chat) {
      chatDisplay = (
        <React.Fragment>
          <ul className="messaging-display__list">
            {chat.messages.map(item => (
              <li
                key={item._id}
                className={
                  item.user._id === userId
                    ? "messaging-display__item messaging-display__item--current-user"
                    : "messaging-display__item messaging-display__item--friend"
                }
              >
                {item.user._id !== userId ? (
                  <div className="user-image">
                    <img
                      src={item.user.profileImage.imageUrl}
                      alt="Profile"
                      className="profile-img"
                    />
                  </div>
                ) : null}

                <div
                  className={
                    item.user._id === userId
                      ? "messaging-display__message messaging-display__message--current"
                      : "messaging-display__message messaging-display__message--friend"
                  }
                >
                  {item.message}

                  <div
                    className={
                      item.user._id === userId
                        ? "messaging-display__message--timestamp-current"
                        : "messaging-display__message--timestamp-friend"
                    }
                  >
                    <Moment fromNow>{item.date}</Moment>
                  </div>
                </div>
              </li>
            ))}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            ></div>
          </ul>

          <form className="messaging-display__form" onSubmit={this.sendMessage}>
            <TextArea
              classname="messaging-display__input"
              onChange={this.onChange}
              value={message}
              name="message"
            />
            <button
              className={
                message.length > 0
                  ? "messaging-display__btn messaging-display__btn--active"
                  : "messaging-display__btn"
              }
              disabled={message.length <= 0}
              type="submit"
            >
              {loading.value &&
              loading.type === "send message" &&
              loading.userId === userId ? (
                <Loading />
              ) : (
                "Send"
              )}
            </button>
          </form>
        </React.Fragment>
      );
    }

    return (
      <section className="messaging-display">
        {chatSidebar}

        <React.Fragment>
          {toggleViewUsers ? (
            <ViewUsersModal onClick={this.toggleUserViews} users={chat.users} />
          ) : null}

          {toggleModal ? (
            <AddFriendModal
              onClick={this.toggleModal}
              addUser={this.addUser}
              friends={friends}
            />
          ) : null}

          {alertDiv}
          {headerDisplay}
          {chatDisplay}
        </React.Fragment>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  userId: state.auth.userId,
  chat: state.user.chat,
  loading: state.loading.loading,
  alertData: state.alert.alert,
  currentUser: state.user.currentUser
});

const actions = {
  getChat,
  createMessage,
  leaveChat,
  addUserToChat
};

export default connect(mapStateToProps, actions)(MessagingDisplay);
