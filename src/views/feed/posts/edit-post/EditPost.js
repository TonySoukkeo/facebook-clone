import React, { Component } from "react";
import SecondaryNavigation from "../../../navigation/SecondaryNavigation";
import { connect } from "react-redux";
import { editPost } from "../../../../controllers/post";
import TextArea from "../../../../common/form/TextArea";
import Loading from "../../../../common/helpers/Loading";

class EditPost extends Component {
  state = {
    value: ""
  };

  async componentDidMount() {
    const postId = this.props.match.params.postId;

    const { currentUser, token } = this.props;

    const post = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Check if currentUser id matches post id
    if (currentUser.id.toString() !== post.post.creator.id.toString()) {
      this.props.history.push("/");
    }

    this.setState({ value: post.post.content });
  }

  onChange = e => {
    const value = e.target.value;
    this.setState({ value });
  };

  editPost = e => {
    e.preventDefault(e);

    const postId = this.props.match.params.postId;
    const { editPost, token, userId } = this.props;
    const { value } = this.state;

    editPost(postId, value, token, this.props, userId);
  };

  render() {
    const { value } = this.state,
      { alertData, loading, userId } = this.props;

    let alertDiv;

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

    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Edit Post" />
        <section className="edit-post">
          {alertDiv}
          <form onSubmit={this.editPost}>
            <TextArea
              classname="edit-post__text"
              value={value}
              name="post"
              onChange={this.onChange}
            />

            <button
              type="submit"
              className={
                !value
                  ? "btn btn--post-status dark-overlay text-grey flex"
                  : "btn btn--post-status"
              }
            >
              {loading.value &&
              loading.type === "edit post" &&
              loading.userId === userId ? (
                <Loading />
              ) : null}{" "}
              Save
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  currentUser: state.user.currentUser,
  alertData: state.alert.alert,
  loading: state.loading.loading,
  userId: state.auth.userId
});

const actions = {
  editPost
};

export default connect(mapStateToProps, actions)(EditPost);
