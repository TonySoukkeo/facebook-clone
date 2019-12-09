import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Settings extends Component {
  logout = () => {
    // Remove UserId and token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Reload page
    window.location.reload();
  };

  render() {
    const { userId, currentUser } = this.props;

    return (
      <section className="settings">
        <ul className="settings__list">
          <li className="settings__items">
            <Link to={`/profile/${userId}`} className="settings__link">
              <div className="settings__image">
                <img
                  className="profile-img"
                  src={currentUser.profileImage.imageUrl}
                  alt="Profile"
                />
              </div>

              <div className="settings__text">{currentUser.fullName}</div>
            </Link>
          </li>
        </ul>

        <p className="settings__title">Help and Settings</p>

        <ul className="settings__list">
          <li className="settings__items">
            <div onClick={this.logout} className="settings__link">
              <div className="settings__icon">
                <i className="fas fa-power-off"></i>
              </div>
              <div className="settings__text">Logout</div>
            </div>
          </li>
        </ul>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId,
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(Settings);
