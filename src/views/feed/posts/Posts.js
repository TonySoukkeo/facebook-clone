import React, { Component } from "react";
import CommentsInput from "./comments/CommentsInput";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { postLike } from "../../../controllers/post";
import { openModal } from "../../../controllers/modal";

// Components
import SettingsDropdown from "./posts-components/SettingsDropdown";
import PostHeader from "./posts-components/PostHeader";
import ConfirmDelete from "./posts-components/ConfirmDelete";
import PostComments from "./posts-components/PostComments";
import Loading from "../../../common/helpers/Loading";

class Posts extends Component {
  state = {
    url: "",
    comment: "",
    reply: "",
    replyImagePreview: null,
    image: null,
    imageData: null,
    isReplying: false,
    edit: false,
    editComment: false,
    confirmDelete: false,
    parentPostId: null,
    mainPostId: null,
    selectedPostId: null,
    selectedCommentId: null,
    selectedReplyId: null
  };

  componentDidMount() {
    const url = this.props.match.url;
    const mainPostId = this.props.match.params.postId;

    this.setState({ url, mainPostId });
  }

  postComment = e => {
    e.preventDefault();

    const postId = this.props.match.params.postId;

    const { postCommentCB, token, userId } = this.props,
      { comment, imageData } = this.state;

    postCommentCB(comment, imageData, postId, token, userId);

    // Reset comment and image value
    this.setState({ comment: "", image: null });
  };

  resetReply = () => {
    this.setState({ isReplying: false });
  };

  onChange = e => {
    const value = e.target.value;
    this.setState({ [e.target.name]: value });
  };

  toggleReply = postId => {
    this.setState({ isReplying: true, parentPostId: postId });
  };

  postReply = e => {
    e.preventDefault();

    const postId = this.props.match.params.postId;

    const { postAddReply, token, userId } = this.props,
      { reply, imageData, parentPostId } = this.state;

    postAddReply(postId, parentPostId, imageData, reply, token, userId);

    // Reset reply and image value
    this.setState({ reply: "", imageData: null, replyImagePreview: null });
  };

  toggleEdit = type => {
    const { edit, editComment } = this.state;

    switch (type) {
      case "post":
        this.setState({ edit: !edit });
        break;

      case "comment":
        this.setState({ editComment: !editComment });
        break;

      default:
        return;
    }
  };

  toggleDelete = () => {
    const { confirmDelete, edit } = this.state;

    this.setState({ confirmDelete: !confirmDelete, edit: !edit });
  };

  deletePost = (postId, token, cb) => {
    const { userId } = this.props;

    cb(postId, token, userId);
  };

  cancelDelete = () => {
    this.setState({ confirmDelete: false });
  };

  selectImage = e => {
    const { isReplying } = this.state;

    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.onload = e => {
        if (isReplying) {
          this.setState({ replyImagePreview: e.target.result });
        } else {
          this.setState({ image: e.target.result });
        }
      };

      this.setState({ imageData: e.target.files[0] });

      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };

  removeImage = () => {
    this.setState({
      image: null,
      imageData: null,
      replyImagePreview: null
    });
  };

  manageLikes = type => {
    const { postLike, token, id, userId } = this.props;

    this.setState({ selectedPostId: id });

    switch (type) {
      case "post":
        postLike(id, token, userId);
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
        userId: user._id.toString(),
        profileImage: user.profileImage.imageUrl
      };
    });

    openModal(modalContent);
  };

  selectComment = commentId => {
    this.setState({ selectedCommentId: commentId });
  };

  selectReply = replyId => {
    this.setState({ selectedReplyId: replyId });
  };

  render() {
    const {
      url,
      comment,
      reply,
      isReplying,
      edit,
      mainPostId,
      confirmDelete,
      image,
      replyImagePreview,
      parentPostId,
      selectedPostId,
      selectedCommentId,
      selectedReplyId
    } = this.state;
    const {
      fullName,
      timestamp,
      privacy,
      postContent,
      postImage,
      profileImage,
      likes,
      comments,
      id,
      userId,
      creatorId,
      token,
      deletePostCB,
      loading,
      currentUserProfileImage
    } = this.props;

    let hasLiked = false;

    if (likes && likes.length > 0) {
      likes.forEach(user => {
        if (user._id === userId) hasLiked = true;
      });
    }

    return (
      <div className="posts">
        {/**** Delete post confirmation ****/}
        {confirmDelete ? (
          <ConfirmDelete
            deletePost={() => this.deletePost(id, token, deletePostCB)}
            cancelDelete={this.cancelDelete}
            loading={loading}
            userId={userId}
          />
        ) : null}

        {/**** Main post header ****/}
        <div className="posts__header container">
          <PostHeader
            profileImage={profileImage}
            timestamp={timestamp}
            fullName={fullName}
            privacy={privacy}
            toggleEdit={() => this.toggleEdit("post")}
            userId={userId}
            creatorId={creatorId}
          />

          {/**** Settings dropdown list ***/}
          {edit ? (
            <SettingsDropdown
              privacy={privacy}
              id={id}
              toggleDelete={this.toggleDelete}
            />
          ) : null}
        </div>

        <div className="posts__body">
          {/**** Main post content ****/}
          <div className="posts__body-text container">{postContent}</div>
          {/**** Main post image ****/}
          {postImage ? (
            <div className="posts__content-image">
              <img src={postImage} alt="Post" />
            </div>
          ) : null}
        </div>
        {/**** Main post likes ****/}
        <div className="posts__reacts container">
          {likes.length > 0 ? (
            <div onClick={this.showLikes} className="posts__reacts-likes">
              <div className="posts__reacts-icon">
                <i className="fas fa-thumbs-up"></i>
              </div>
              <span>{likes.length}</span>
            </div>
          ) : null}

          <Link to={`/comment/${id}`} className="posts__reacts-comments">
            {comments.length === 1
              ? "1 comment"
              : comments.length > 1
              ? `${comments.length} comments`
              : null}
          </Link>
        </div>

        <div className="horizontal-line"></div>

        {/**** Main post footer ****/}
        <div className="posts__footer container">
          <div
            onClick={loading.value ? null : () => this.manageLikes("post")}
            className={
              hasLiked
                ? "posts__footer-action posts__footer-action--active"
                : "posts__footer-action"
            }
          >
            {" "}
            <span>
              <i className="fas fa-thumbs-up"></i>
            </span>{" "}
            {loading.value &&
            loading.type === "like post" &&
            loading.userId === userId &&
            selectedPostId === id ? (
              <Loading />
            ) : (
              "like"
            )}
          </div>

          <div className="posts__footer-action">
            <Link to={`/comment/${id}`} className="link">
              <span>
                <i className="far fa-comment-alt"></i>
              </span>{" "}
              Comment
            </Link>
          </div>
        </div>

        {/***** Display comments for the post *****/}
        {url === `/comment/${id}` ? (
          <React.Fragment>
            <div className="horizontal-line"></div>
            <div className="posts__comments container">
              {/**** Add a comment to a post ****/}
              <form onSubmit={this.postComment}>
                <CommentsInput
                  onClick={this.resetReply}
                  isReplying={isReplying}
                  classname="form__input--comment"
                  placeholder="Write a comment..."
                  name="comment"
                  onChange={this.onChange}
                  value={comment}
                  currentUserProfileImage={currentUserProfileImage}
                  selectImage={this.selectImage}
                  removeImage={this.removeImage}
                  image={image}
                  loading={loading}
                  userId={userId}
                />
              </form>
            </div>

            <div className="horizontal-line"></div>

            {/**** Display all comments for the post ****/}
            {comments &&
              comments.map(comment => (
                <PostComments
                  key={comment._id.toString()}
                  toggleReply={() => this.toggleReply(comment._id.toString())}
                  reply={reply}
                  content={comment.content}
                  fullName={comment.user.fullName}
                  profileImage={comment.user.profileImage.imageUrl}
                  postImage={comment.postImage}
                  postReply={this.postReply}
                  onChange={this.onChange}
                  removeImage={this.removeImage}
                  timestamp={comment.createdAt}
                  selectedPostId={parentPostId}
                  commentId={comment._id.toString()}
                  selectImage={this.selectImage}
                  currentUserProfileImage={currentUserProfileImage}
                  replyImagePreview={replyImagePreview}
                  isReplying={isReplying}
                  replies={comment.replies}
                  userId={userId}
                  likes={comment.likes}
                  creatorId={comment.user._id.toString()}
                  parentPostId={parentPostId}
                  mainPostId={mainPostId}
                  selectComment={this.selectComment}
                  selectedCommentId={selectedCommentId}
                  selectReply={this.selectReply}
                  selectedReplyId={selectedReplyId}
                  loading={loading}
                />
              ))}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const actions = {
  postLike,
  openModal
};

const mapStateToProps = state => ({
  loading: state.loading.loading
});

export default compose(withRouter, connect(mapStateToProps, actions))(Posts);
