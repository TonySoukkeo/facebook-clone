import React, { Component } from "react";
import { getNotifications, clearNotifications } from "../../controllers/user";
import NotificationsList from "./components/NotificationsList";
import uuidv4 from "uuid/v4";
import Loading from "../../common/helpers/Loading";
import FriendSidebar from "../../components/FriendSidebar";
import { connect } from "react-redux";

class Notifications extends Component {
  state = {
    windowWidth: null
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    const { getNotifications, token } = this.props;

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    getNotifications(userId, token);
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  clearNotifications = () => {
    const { currentUser, token, clearNotifications } = this.props;

    clearNotifications(currentUser._id.toString(), token, "clear");
  };

  render() {
    const { notifications, loading, currentUser } = this.props;
    const { windowWidth } = this.state;

    let display;

    if (
      notifications &&
      notifications.content &&
      notifications.content.length > 0
    ) {
      display = (
        <div className="notifications__content">
          {notifications.content.map(item => (
            <NotificationsList
              key={uuidv4()}
              sourcePostId={item.payload.sourcePost}
              userImage={item.payload.userImage}
              message={item.message}
              alertType={item.payload.alertType}
              date={item.date}
              friendId={item.payload.friendId || null}
            />
          ))}
        </div>
      );
    } else {
      display = (
        <div className="text-center mt-sm notifications__content">
          No notifications
        </div>
      );
    }

    return (
      <section className="notifications grid">
        {windowWidth > 790 ? <FriendSidebar /> : null}

        <div className="notifications__header p-sm">
          <h2>Notifications</h2>
          <p onClick={!loading.value ? this.clearNotifications : null}>
            {loading.value && loading.userId === currentUser._id ? (
              <Loading />
            ) : (
              "Clear"
            )}
          </p>
        </div>
        {display}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.user.notifications,
  token: state.auth.token,
  currentUser: state.user.currentUser,
  loading: state.loading.loading
});

const actions = {
  getNotifications,
  clearNotifications
};

export default connect(mapStateToProps, actions)(Notifications);
