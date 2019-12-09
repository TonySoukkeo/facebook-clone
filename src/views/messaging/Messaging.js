import React, { Component } from "react";
import { getMessages } from "../../controllers/user";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FriendSidebar from "../../components/FriendSidebar";

class Messaging extends Component {
  state = {
    windowWidth: null
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    const { token, getMessages } = this.props;

    getMessages(userId, token);
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  render() {
    const { messages, currentUser } = this.props;
    const { windowWidth } = this.state;

    let messageDisplay;

    if (messages && messages.content && messages.content.length > 0) {
      messageDisplay = (
        <ul className="messaging__list">
          {messages.content.map(item => {
            const message = item.messages[item.messages.length - 1];

            return (
              <Link
                to={`/message/${item._id}`}
                key={message._id}
                className="messaging__item"
              >
                <div className="user-image user-image--sm-2">
                  <img
                    src={message.user.profileImage.imageUrl}
                    alt="Profile"
                    className="profile-img"
                  />
                </div>

                <div className="messaging__item-content">
                  <div className="messaging__item-content-header">
                    <p>{`${message.user.firstName} ${message.user.lastName}`}</p>

                    <div className="messaging__item-content-date">
                      <Moment fromNow ago>
                        {message.date}
                      </Moment>
                    </div>
                  </div>
                  <div className="messaging__item-content-message">
                    {message.message.length > 55
                      ? message.message.slice(0, 55) + "..."
                      : message.message}
                  </div>
                </div>
              </Link>
            );
          })}
        </ul>
      );
    } else {
      messageDisplay = <div className="text-center mt-sm">No messages</div>;
    }

    return (
      <section className="messaging grid">
        {windowWidth > 790 ? <FriendSidebar /> : null}
        <div className="messaging__header">
          <Link
            to={`/message-single/${currentUser && currentUser._id.toString()}`}
            className="messaging__header-single"
          >
            <i className="fas fa-edit"></i>
            <span>New Message</span>
          </Link>
        </div>

        {messageDisplay}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  token: state.auth.token,
  messages: state.user.messages
});

const actions = {
  getMessages
};

export default connect(mapStateToProps, actions)(Messaging);
