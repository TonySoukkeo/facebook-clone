import React, { Component } from "react";
import SecondaryNavigation from "../../../navigation/SecondaryNavigation";
import { connect } from "react-redux";
import { changePrivacy } from "../../../../controllers/post";

class EditPrivacy extends Component {
  state = {
    privacy: null
  };

  async componentDidMount() {
    // Get currentUser id
    const { token, currentUser } = this.props;
    const postId = this.props.match.params.postId;

    const privacy = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/posts/privacy/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Check if currentUser id matches creator id
    if (currentUser.id.toString() !== privacy.creatorId.toString()) {
      this.props.history.push("/");
    }

    this.setState({ privacy: privacy.privacy });
  }

  changePrivacy = value => {
    const postId = this.props.match.params.postId;
    const { changePrivacy, token } = this.props;

    changePrivacy(value, token, postId, this.props);
  };

  render() {
    const { privacy } = this.state,
      { alertData } = this.props;

    let display, alertDiv;

    if (alertData) {
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

    if (privacy) {
      display = (
        <ul className="edit-privacy__list">
          <li className="edit-privacy__item">
            <div className="edit-privacy__icon">
              <i className="fas fa-globe-americas"></i>
            </div>

            <div className="edit-privacy__text-container">
              <p>Public</p>
              <p className="text-secondary">Anyone on or off Facebook</p>
            </div>

            <div
              onClick={() => this.changePrivacy("public")}
              className={
                privacy === "public"
                  ? "edit-privacy__value edit-privacy__value--active"
                  : "edit-privacy__value"
              }
            >
              {privacy === "public" ? <i className="fas fa-check"></i> : null}
            </div>
          </li>

          <li className="edit-privacy__item">
            <div className="edit-privacy__icon">
              <i className="fas fa-user-friends"></i>
            </div>

            <div className="edit-privacy__text-container">
              <p>Friends</p>
              <p className="text-secondary">Your friends on Facebook</p>
            </div>

            <div
              onClick={() => this.changePrivacy("friends")}
              className={
                privacy === "friends"
                  ? "edit-privacy__value edit-privacy__value--active"
                  : "edit-privacy__value"
              }
            >
              {privacy === "friends" ? <i className="fas fa-check"></i> : null}
            </div>
          </li>
        </ul>
      );
    }
    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Privacy" />
        <section className="edit-privacy">
          {alertDiv}
          {display}
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  alertData: state.alert.alert,
  currentUser: state.user.currentUser
});

const actions = {
  changePrivacy
};

export default connect(mapStateToProps, actions)(EditPrivacy);
