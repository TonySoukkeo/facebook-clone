import { ERROR as ALERT_ERROR } from "../redux/reducers/alert/AlertConstants";
import { LOADING } from "../redux/reducers/loading/LoadingConstants";
import { GET_POST, MODIFY_POST } from "../redux/reducers/post/PostConstants";
import {
  MODIFY_POSTS,
  CHANGE_PRIVACY,
  DELETE_POST
} from "../redux/reducers/user/UserConstants";

/***************
 * Post Status *
 ***************/
export const postStatus = (
  postData,
  token,
  props,
  userId
) => async dispatch => {
  const { post, image, privacy } = postData;

  try {
    // Check if both post and image are null
    if (!post && !image) {
      const error = new Error("Post cannot be empty");
      error.type = "error";
      throw error;
    }

    // Continue if there are no errors

    dispatch({
      type: LOADING,
      payload: {
        type: "post status",
        userId,
        value: true
      }
    });

    const formData = new FormData();

    formData.append("content", post);
    formData.append("privacy", privacy);

    if (image) {
      formData.append("image", image);
    }

    await fetch(`${process.env.REACT_APP_API_URI}/user/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    }).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "post status",
        userId: null,
        value: false
      }
    });

    // redirect back to homepage
    props.history.push("/");
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***********************
 * Change post privacy *
 ***********************/
export const changePrivacy = (
  value,
  token,
  postId,
  props
) => async dispatch => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/posts/privacy`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          privacy: value,
          postId
        })
      }
    ).then(async res => await res.json());

    if (response.status === 403) {
      const error = new Error(response.message);
      error.type = "error";
      throw error;
    }

    // Continue if there are no errors

    // Redirect back to homepage
    props.history.push("/");
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*************
 * Edit Post *
 *************/
export const editPost = (
  postId,
  value,
  token,
  props,
  userId
) => async dispatch => {
  try {
    // Check if value is empty
    if (!value) {
      const error = new Error("Post cannot be empty");
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit post",
        userId,
        value: true
      }
    });

    // Continue if there are no errors
    const updatedPost = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: value,
          postId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "edit post",
        userId: null,
        value: false
      }
    });

    if (updatedPost.status === 403) {
      const error = new Error(updatedPost.message);
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit post",
        userId: null,
        value: false
      }
    });

    // Redirect user back to homepage
    props.history.push("/");
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***************
 * Delete Post *
 ***************/
export const deletePost = (postId, token, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "delete post",
        userId,
        value: true
      }
    });

    const post = await fetch(`${process.env.REACT_APP_API_URI}/user/post`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        postId
      })
    }).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "delete post",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (post.status === 403 || post.status === 404) {
      const error = new Error(post.message);
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "delete post",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

export const removePost = postId => dispatch => {
  dispatch({ type: DELETE_POST, payload: postId });
};

/*******************
 * Get single post *
 *******************/
export const getPost = (postId, token) => async dispatch => {
  try {
    const post = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // continue if there are no errors
    dispatch({ type: GET_POST, payload: post.post });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*******************
 * Comment on post *
 *******************/
export const postComment = (
  comment,
  image,
  postId,
  token,
  userId
) => async dispatch => {
  try {
    // Check if both comment and image is empty
    if (!comment && !image) {
      const error = new Error("Comment cannot be empty");
      error.type = "error";

      throw error;
    }

    const formData = new FormData();

    formData.append("content", comment);

    // Check if there is an image selected
    if (image) {
      formData.append("image", image);
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "comment post",
        userId,
        value: true
      }
    });

    const postComment = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/comment/${postId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "comment post",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (postComment.status === 403 || postComment.status === 422) {
      const error = new Error(postComment.message);
      error.type = "error";

      throw error;
    }

    // Continue if there are no errors
    dispatch({
      type: LOADING,
      payload: {
        type: "comment post",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/********************
 * Reply on comment *
 ********************/
export const postAddReply = (
  postId,
  parentPostId,
  image,
  content,
  token,
  userId
) => async dispatch => {
  try {
    // Check if content and image are undefined
    if (!content && !image) {
      const error = new Error("Post cannot be empty");
      error.type = "error";

      throw error;
    }

    const formData = new FormData();

    formData.append("content", content);
    formData.append("commentId", parentPostId);
    formData.append("userId", userId);

    // Check if there is an image
    if (image) {
      formData.append("image", image);
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "comment reply",
        userId,
        value: true
      }
    });

    const reply = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/reply/${postId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "comment reply",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (reply.status === 404) {
      const error = new Error(reply.message);
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "comment reply",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/****************
 * Edit comment *
 ****************/
export const editComment = (
  postId,
  commentId,
  content,
  token,
  userId
) => async dispatch => {
  try {
    // Check if content is empty
    if (!content) {
      const error = new Error("Edit value cannot be empty");
      error.type = "error";
      error.status = 422;
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit comment",
        userId,
        value: true
      }
    });

    // Continue if there are no errors
    const editedComment = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/comment/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commentId,
          content
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "edit comment",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (
      editedComment.status === 403 ||
      editedComment.status === 404 ||
      editedComment.status === 422
    ) {
      const error = new Error(editedComment.message);
      error.type = "error";
      error.status = editedComment.status;
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit comment",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/**************
 * Edit reply *
 **************/
export const editReply = (
  postId,
  commentId,
  replyId,
  token,
  content,
  userId
) => async dispatch => {
  try {
    // Check if content isn't undefined
    if (!content) {
      const error = new Error("Edit value cannot be empty");
      error.type = "error";
      error.status = 422;
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit reply",
        userId,
        value: true
      }
    });

    // Continue if there are no errors
    const editedReply = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/reply/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commentId,
          content,
          replyId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "edit reply",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (editReply.status === 422 || editReply.status === 403) {
      const error = new Error(editedReply.message);
      error.type = "error";
      error.status = editedReply.status;
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "edit reply",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/****************
 * Delete reply *
 ****************/
export const deleteReply = (
  postId,
  commentId,
  replyId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "delete reply",
        userId,
        value: true
      }
    });

    const deletedReply = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/reply/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commentId,
          replyId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "delete reply",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (deletedReply.status === 403 || deletedReply.status === 404) {
      const error = new Error(deleteReply.message);
      error.status = deleteReply.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "delete reply",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/******************
 * Delete Comment *
 ******************/
export const deleteComment = (
  postId,
  commentId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "delete comment",
        userId,
        value: true
      }
    });

    const deletedComment = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/comment/${postId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          commentId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "delete comment",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (deletedComment.status === 403 || deletedComment.status === 404) {
      const error = new Error(deleteComment.message);
      error.status = deleteComment.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "delete comment",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***************************
 * Remove/Add like to post *
 ***************************/
export const postLike = (postId, token, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "like post",
        userId,
        value: true
      }
    });

    const likedPost = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId
        })
      }
    ).then(async res => await res.json());

    // Check if user has already liked the post
    // If so, unlike the post
    if (likedPost.status === 422) {
      const unlikedPost = await fetch(
        `${process.env.REACT_APP_API_URI}/feed/post/like`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postId
          })
        }
      ).then(async res => await res.json());

      dispatch({
        type: LOADING,
        payload: {
          type: "like post",
          userId: null,
          value: false
        }
      });

      // Check for any errors
      if (unlikedPost.status === 403) {
        const error = new Error(unlikedPost.message);
        error.status = unlikedPost.status;
        error.type = "error";

        throw error;
      }

      dispatch({
        type: LOADING,
        payload: {
          type: "like post",
          userId: null,
          value: false
        }
      });
    }

    // Check for any errors
    if (likedPost.status === 403) {
      const error = new Error(likedPost.message);
      error.status = likedPost.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "like post",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/******************************
 * Remove/Add like to Comment *
 ******************************/
export const commentLike = (
  postId,
  commentId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "comment like",
        userId,
        value: true
      }
    });

    const likedComment = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/post/comment/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId,
          commentId
        })
      }
    ).then(async res => await res.json());

    // Check to see if user hasn't already liked the post
    if (likedComment.status === 422) {
      const unlikedComment = await fetch(
        `${process.env.REACT_APP_API_URI}/feed/post/comment/like`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postId,
            commentId
          })
        }
      ).then(async res => await res.json());

      dispatch({
        type: LOADING,
        payload: {
          type: "comment like",
          userId: null,
          value: false
        }
      });

      // Check for any errors
      if (unlikedComment.status === 403 || unlikedComment.status === 404) {
        const error = new Error(unlikedComment.message);
        error.status = unlikedComment.status;
        error.type = "error";
        throw error;
      }
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "comment like",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (likedComment.status === 403 || likedComment.status === 404) {
      const error = new Error(likedComment.message);
      error.status = likedComment.status;
      error.type = "error";
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "comment like",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/****************************
 * Remove/Add like to reply *
 ****************************/
export const replyLike = (
  postId,
  commentId,
  replyId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "reply like",
        userId,
        value: true
      }
    });

    const likedReply = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/reply/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId,
          commentId,
          replyId
        })
      }
    ).then(async res => await res.json());

    // Check to see if user hasn't already liked the post
    if (likedReply.status === 422) {
      const unlikedReply = await fetch(
        `${process.env.REACT_APP_API_URI}/feed/reply/like`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            postId,
            commentId,
            replyId
          })
        }
      ).then(async res => await res.json());

      dispatch({
        type: LOADING,
        payload: {
          type: "reply like",
          userId: null,
          value: false
        }
      });

      // Check for any errors
      if (unlikedReply.status === 403 || unlikedReply.status === 404) {
        const error = new Error(unlikedReply.message);
        error.status = unlikedReply.status;
        error.type = "error";
        throw error;
      }
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "reply like",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (likedReply.status === 403 || likedReply.status === 404) {
      const error = new Error(likedReply.message);
      error.status = likedReply.status;
      error.type = "error";
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "reply like",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*********************************
 *  Modify posts on post reducer *
 *********************************/
export const modifyPosts = updatedPost => async dispatch => {
  try {
    await dispatch({ type: MODIFY_POSTS, payload: updatedPost });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***********************
 *  Modify single post *
 ***********************/
export const modifyPost = (updatedPost, postData = null) => async dispatch => {
  try {
    if (!postData) {
      await dispatch({ type: MODIFY_POST, payload: updatedPost });
    } else {
      await dispatch({ type: CHANGE_PRIVACY, payload: postData });
    }
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};
