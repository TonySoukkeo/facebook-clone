import React, { Component } from "react";
import { connect } from "react-redux";
import TextInput from "../common/form/TextInput";

class AddFriendModal extends Component {
  state = {
    selectFriend: "",
    friendResults: []
  };

  onChange = e => {
    const value = e.target.value;

    const { friends } = this.props;

    this.setState({ [e.target.name]: value });

    if (e.target.name !== "message") {
      const regex = new RegExp([value], "i");

      const result = friends.filter(friend => regex.test(friend.fullName));

      this.setState({ friendResults: result });
    }
  };

  render() {
    const { selectFriend, friendResults } = this.state;
    const { onClick, addUser } = this.props;

    return (
      <div className="modal-overlay modal-overlay--active">
        <div className="modal modal--active">
          <div className="modal__header">
            <i onClick={onClick} className="fas fa-times mt-sm mr-sm"></i>
          </div>
          <div className="search__input-container">
            <i className="fas fa-search"></i>
            <TextInput
              type="text"
              name="selectFriend"
              value={selectFriend}
              onChange={this.onChange}
              placeholder="Search"
              className="search__input"
            />
          </div>
          {friendResults.length > 0 ? (
            <ul className="modal__addfriend-list">
              {friendResults.map(friend => (
                <li key={friend._id} className="modal__addfriend-item">
                  <div className="user-image">
                    <img
                      className="profile-img"
                      src={friend.profileImage.imageUrl}
                      alt="profile"
                    />
                  </div>
                  <p>{friend.fullName}</p>

                  <i
                    onClick={() => addUser(friend.id)}
                    className="fas fa-plus"
                  ></i>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
});

export default connect(mapStateToProps)(AddFriendModal);
