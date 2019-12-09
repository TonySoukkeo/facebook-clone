import React, { Component } from "react";
import { connect } from "react-redux";
import { deletePost } from "../../controllers/post";
import uuidv4 from "uuid/v4";
import Loading from "../../common/helpers/Loading";

import Posts from "./posts/Posts";

class Feed extends Component {
  render() {
    const { feedPosts, currentUser, token, deletePost, alertData } = this.props;
    let display, alertDiv;

    if (alertData && alertData.message) {
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
    if (feedPosts.length > 0) {
      display = (
        <React.Fragment>
          {alertDiv}

          {feedPosts.map(post => (
            <Posts
              key={uuidv4()}
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
            />
          ))}
        </React.Fragment>
      );
    } else {
      display = (
        <div className="text-center">
          <Loading />
        </div>
      );
    }

    return <section className="feed">{display}</section>;
  }
}

const mapStateToProps = state => ({
  feedPosts: state.user.feedPosts,
  currentUser: state.user.currentUser,
  token: state.auth.token,
  alertData: state.alert.alert
});

const actions = {
  deletePost
};

export default connect(mapStateToProps, actions)(Feed);
