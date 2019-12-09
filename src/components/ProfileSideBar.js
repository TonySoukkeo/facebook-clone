import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class ProfileSideBar extends Component {
  render() {
    const { currentUser, isAuth } = this.props;

    return (
      <div className="profileSidebar container">
        {isAuth ? (
          <React.Fragment>
            <Link
              to={`profile/${currentUser && currentUser._id}`}
              className="profileSidebar__profile"
            >
              <div className="user-image user-image--sm">
                <img
                  src={currentUser && currentUser.profileImage.imageUrl}
                  alt="Profile"
                  className="profile-img"
                />
              </div>
              <p>{currentUser && currentUser.fullName}</p>
            </Link>

            <ul className="profileSidebar__list">
              <Link to="/" className="profileSidebar__item">
                <i className="far fa-newspaper"></i>
                News Feed
              </Link>

              <Link
                to={`/messaging/${currentUser && currentUser._id}`}
                className="profileSidebar__item"
              >
                <i className="fab fa-facebook-messenger"></i>
                Messenger
              </Link>
            </ul>
          </React.Fragment>
        ) : (
          <div className="profileSidebar__guest">
            <div className="profileSidebar__guest-header">
              <p>
                <Link to="/login" className="profileSidebar__link">
                  Login
                </Link>{" "}
                or{" "}
                <Link to="/register" className="profileSidebar__link">
                  Register
                </Link>
              </p>
              <p>For full access</p>
            </div>

            <div className="profileSidebar__icon">
              <i className="far fa-user"></i>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps)(ProfileSideBar);
