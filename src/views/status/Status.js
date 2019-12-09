import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Status extends Component {
  render() {
    const { userId, currentUser } = this.props;

    let display;

    if (currentUser) {
      display = (
        <div className="status__card">
          <div>
            <Link
              to={`/profile/${userId}`}
              className="status__card-image user-image"
            >
              <img
                src={currentUser.profileImage.imageUrl}
                alt="profile"
                className="profile-img"
              />
            </Link>
          </div>

          <Link to={`status/${userId}`} className="status__card-input">
            What's on your mind?
          </Link>
        </div>
      );
    }

    return <section className="status container">{display}</section>;
  }
}

const mapStateToProps = state => ({
  userId: state.auth.userId
});

export default connect(mapStateToProps)(Status);
