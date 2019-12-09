import React, { Component } from "react";
import SecondaryNavigation from "../../../navigation/SecondaryNavigation";
import Posts from "../../posts/Posts";
import {
  getPost,
  deletePost,
  postComment,
  postAddReply,
  modifyPost
} from "../../../../controllers/post";
import FriendSidebar from "../../../../components/FriendSidebar";
import openSocket from "socket.io-client";
import { connect } from "react-redux";

class Comments extends Component {
  state = {
    windowWidth: null
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;

    const { token, getPost } = this.props;

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    getPost(postId, token);

    const socket = openSocket(`${process.env.REACT_APP_API_URI}`);

    socket.on("posts", data => {
      switch (data.action) {
        case "comment":
        case "reply":
        case "edit comment":
        case "edit reply":
        case "remove reply":
        case "remove comment":
        case "add post like":
          getPost(postId, token);
          return;

        default:
          return;
      }
    });
  }
  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  render() {
    const {
      post,
      token,
      currentUser,
      loading,
      deletePost,
      postComment,
      postAddReply
    } = this.props;
    const { windowWidth } = this.state;

    let display;

    if (post) {
      display = (
        <Posts
          fullName={post.creator.fullName}
          timestamp={post.createdAt}
          privacy={post.privacy}
          postContent={post.content}
          postImage={post.postImage}
          likes={post.likes}
          profileImage={post.creator.profileImage.imageUrl}
          comments={post.comments}
          id={post._id.toString()}
          creatorId={post.creator._id.toString()}
          userId={currentUser && currentUser._id}
          token={token}
          deletePostCB={deletePost}
          loading={loading}
          postCommentCB={postComment}
          currentUserProfileImage={
            currentUser && currentUser.profileImage.imageUrl
          }
          postAddReply={postAddReply}
        />
      );
    }
    return (
      <React.Fragment>
        {windowWidth < 790 ? (
          <SecondaryNavigation navTitle="Post title" />
        ) : null}

        {windowWidth > 790 ? <FriendSidebar /> : null}

        <section className="comments">{display}</section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token,
  isAuth: state.auth.isAuth,
  post: state.post.post,
  currentUser: state.user.currentUser,
  loading: state.loading.loading
});

const actions = {
  getPost,
  deletePost,
  postComment,
  postAddReply,
  modifyPost
};

export default connect(mapStateToProps, actions)(Comments);
