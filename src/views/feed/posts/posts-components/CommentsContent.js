import React, { Component } from "react";
import TextArea from "../../../../common/form/TextArea";
import { connect } from "react-redux";
import {
  editComment,
  editReply,
  deleteReply,
  deleteComment,
  commentLike,
  replyLike
} from "../../../../controllers/post";
import { openModal } from "../../../../controllers/modal";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Loading from "../../../../common/helpers/Loading";

class CommentsContent extends Component {
  state = {
    toggleMore: false,
    editComment: false,
    comment: "",
    commentId: null
  };

  componentDidMount() {
    const { content } = this.props;

    this.setState({ comment: content });
  }

  toggleMore = commentId => {
    const { toggleMore } = this.state;

    this.setState({ toggleMore: !toggleMore, commentId });
  };

  editComment = () => {
    this.setState({ editComment: true, toggleMore: false });
  };

  postEditComment = e => {
    e.preventDefault();

    const { comment } = this.state;
    const { token, commentId, editComment, mainPostId, userId } = this.props;

    editComment(mainPostId, commentId, comment, token, userId);

    // Reset state for editing
    this.setState({ editComment: false });
  };

  postEditReply = e => {
    e.preventDefault();
    const { comment } = this.state;
    const {
      mainPostId,
      commentId,
      replyId,
      token,
      editReply,
      userId
    } = this.props;

    editReply(mainPostId, commentId, replyId, token, comment, userId);

    // Reset state for editing
    this.setState({ editComment: false });
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  deleteComment = () => {
    const {
      token,
      mainPostId,
      commentId,
      replyId,
      type,
      deleteReply,
      deleteComment,
      userId
    } = this.props;

    if (type === "reply") {
      // Remove reply from comment
      deleteReply(mainPostId, commentId, replyId, token, userId);
    } else {
      // Remove entire comment
      deleteComment(mainPostId, commentId, token, userId);
    }
  };

  cancel = () => {
    this.setState({ editComment: false });
  };

  likeComment = type => {
    const {
      commentId,
      mainPostId,
      commentLike,
      token,
      replyId,
      replyLike,
      userId
    } = this.props;

    switch (type) {
      case "comment":
        commentLike(mainPostId, commentId, token, userId);
        break;

      case "reply":
        replyLike(mainPostId, commentId, replyId, token, userId);
        break;

      default:
        return;
    }
  };

  showLikes = () => {
    const { openModal, likes } = this.props;

    // Loop through likes and return user image, name, and userId
    const modalContent = likes.map(user => {
      return {
        name: user.fullName,
        userId: user.id.toString(),
        profileImage: user.profileImage.imageUrl
      };
    });

    openModal(modalContent);
  };

  render() {
    const {
      profileImage,
      fullName,
      postImage,
      content,
      addedClass = null,
      replying = false,
      toggleReply,
      commentId = null,
      userId,
      creatorId,
      type = "comment",
      timestamp,
      likes,
      loading,
      selectComment,
      selectedCommentId,
      selectReply,
      selectedReplyId,
      replyId
    } = this.props;

    const { toggleMore, editComment, comment } = this.state;

    let display, likesDisplay, likeButton;
    let hasLiked = false;

    if (type === "comment") {
      likeButton = (
        <div
          onClick={() => this.likeComment(type)}
          className="posts__comments-wrapper--footer-action"
        >
          {loading.value &&
          loading.type === "comment like" &&
          loading.userId === userId &&
          selectedCommentId === commentId ? (
            <Loading />
          ) : (
            <p
              onClick={() => selectComment(commentId)}
              className={hasLiked ? "posts__comments-text-active" : null}
            >
              Like
            </p>
          )}
        </div>
      );
    } else if (type === "reply") {
      likeButton = (
        <div
          onClick={() => this.likeComment(type)}
          className="posts__comments-wrapper--footer-action"
        >
          {loading.value &&
          loading.type === "reply like" &&
          loading.userId === userId &&
          selectedReplyId === replyId ? (
            <Loading />
          ) : (
            <p
              onClick={() => selectReply(replyId)}
              className={hasLiked ? "posts__comments-text-active" : null}
            >
              Like
            </p>
          )}
        </div>
      );
    }

    if (likes && likes.length > 0) {
      likesDisplay = (
        <div onClick={this.showLikes} className="posts__reacts-likes">
          <div className="posts__reacts-icon mr-sm">
            <i className="fas fa-thumbs-up"></i>
          </div>
          <span className="text-sm">{likes.length}</span>
        </div>
      );

      // check if user has liked the comment
      likes.forEach(post => {
        if (post._id === userId) hasLiked = true;
      });
    }

    if (!editComment) {
      display = (
        <React.Fragment>
          <div
            className={
              replying
                ? "posts__comments-content-card ml-lg mt-md"
                : "posts__comments-content-card"
            }
          >
            <Link
              to={`/profile/${userId}`}
              className={addedClass ? `user-image ${addedClass}` : "user-image"}
            >
              <img src={profileImage} alt="Profile" className="profile-img" />
            </Link>

            <div className="posts__comments-content--comment">
              {/**** Comment name title ****/}
              <Link
                to={`/profile/${userId}`}
                className="posts__comments-content--name"
              >
                {fullName}
              </Link>

              {/**** Comment content ****/}
              <p className="paragraph">{content}</p>

              {postImage ? (
                <div className="posts__comments-post-image">
                  <img src={postImage} alt="Post" className="image" />
                </div>
              ) : null}
              <div className="posts__comments-content--comment-likes">
                {likesDisplay}
              </div>
            </div>
          </div>

          {/***** Like and reply buttons for comment *****/}
          <div
            className={
              replying
                ? "posts__comments-wrapper--footer pl-lg"
                : "posts__comments-wrapper--footer"
            }
          >
            <div className="posts__comments-wrapper--footer-timestamp">
              <Moment fromNow ago>
                {timestamp}
              </Moment>
            </div>

            {likeButton}

            {!replying ? (
              <div
                onClick={toggleReply}
                className="posts__comments-wrapper--footer-action"
              >
                <p>Reply</p>
              </div>
            ) : null}

            {userId === creatorId ? (
              <div
                onClick={() => this.toggleMore(commentId)}
                className="posts__comments-wrapper--footer-action"
              >
                <p>More</p>
              </div>
            ) : null}
          </div>
        </React.Fragment>
      );
    } else {
      display = (
        <form
          onSubmit={
            type === "reply" ? this.postEditReply : this.postEditComment
          }
          className="posts__comments-edit-form"
        >
          <TextArea
            classname="posts__comments-edit-form--input"
            value={comment}
            name="comment"
            onChange={this.onChange}
          />

          <div className="posts__comments-edit-btn">
            <div onClick={this.deleteComment}>Delete</div>

            <button type="submit">Update</button>

            <div onClick={this.cancel}>Cancel</div>
          </div>
        </form>
      );
    }

    return (
      <div>
        {display}
        {/**** Edit comment dropdown ***/}
        {toggleMore ? (
          <ul className="posts__comments-edit-list">
            <li
              onClick={this.editComment}
              className="posts__comments-edit-item"
            >
              Edit
            </li>
            <li
              onClick={
                (loading.value &&
                  loading.type === "delete comment" &&
                  loading.userId === userId &&
                  type === "comment") ||
                (loading.value &&
                  loading.type === "delete reply" &&
                  loading.userId === userId &&
                  type === "reply")
                  ? null
                  : this.deleteComment
              }
              className="posts__comments-edit-item"
            >
              {(loading.value &&
                loading.type === "delete comment" &&
                loading.userId === userId &&
                type === "comment") ||
              (loading.value &&
                loading.type === "delete reply" &&
                loading.userId === userId &&
                type === "reply") ? (
                <Loading />
              ) : (
                "Delete"
              )}
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  loading: state.loading.loading
});

const actions = {
  editComment,
  editReply,
  deleteReply,
  deleteComment,
  commentLike,
  replyLike,
  openModal
};

export default connect(mapStateToProps, actions)(CommentsContent);
