import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { closeModal } from "../controllers/modal";
import { sendFriendRequest } from "../controllers/user";

class Modal extends Component {
  closeModal = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  sendFriendRequest = friendId => {
    // Send friend request
    const { currentUser, sendFriendRequest, token } = this.props;

    sendFriendRequest(currentUser._id.toString(), friendId, token);
  };

  render() {
    const { openModal, currentUser } = this.props;

    return (
      <div
        className={
          openModal ? "modal-overlay modal-overlay--active" : "modal-overlay"
        }
      >
        <div className={openModal ? "modal modal--active container" : null}>
          {openModal ? (
            <div className="modal__header">
              <div className="modal__header-likes">
                <i className="fas fa-thumbs-up"></i>
              </div>
              <span className="text-sm text-blue">
                {openModal && openModal.length}
              </span>

              <i onClick={this.closeModal} className="fas fa-times"></i>
            </div>
          ) : null}

          {/*** Modal Content ***/}
          <ul className="modal__header-list">
            {openModal &&
              openModal.map(user => (
                <li key={user.userId} className="modal__header-item">
                  <Link
                    to={`/profile/${user.userId}`}
                    onClick={this.closeModal}
                    className="modal__header-user"
                  >
                    <div className="user-image user-image--sm-2 mr-md">
                      <img
                        src={user.profileImage}
                        className="profile-img"
                        alt="Profile"
                      />
                    </div>

                    <div className="modal__header-item-name">{user.name}</div>
                  </Link>

                  {currentUser._id.toString() !== user.userId.toString() ? (
                    !currentUser.friends.find(
                      friend => friend._id.toString() === user.userId.toString()
                    ) ? (
                      <button
                        onClick={() =>
                          this.sendFriendRequest(user.userId.toString())
                        }
                        className="btn btn-light"
                      >
                        <i className="fas fa-user-plus"></i> Add Friend
                      </button>
                    ) : (
                      <button className="btn btn-light">
                        <i className="fas fa-check"></i> Friends
                      </button>
                    )
                  ) : null}
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openModal: state.modal.openModal,
  currentUser: state.user.currentUser,
  token: state.auth.token
});

const actions = {
  closeModal,
  sendFriendRequest
};

export default connect(mapStateToProps, actions)(Modal);
