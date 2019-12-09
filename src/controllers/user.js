import {
  GET_USER,
  GET_FEED_POSTS,
  GET_NOTIFICATIONS,
  GET_MESSAGES,
  GET_CHAT,
  GET_FRIEND_REQUESTS
} from "../redux/reducers/user/UserConstants";
import { ERROR as ALERT_ERROR } from "../redux/reducers/alert/AlertConstants";
import { LOADING } from "../redux/reducers/loading/LoadingConstants";
import { INPUT_ERROR } from "../redux/reducers/error-handling/ErrorConstants";

/************************
 * Get current user info *
 ************************/
export const getUser = userId => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "get user",
        userId,
        value: true
      }
    });

    const user = await fetch(
      `${process.env.REACT_APP_API_URI}/user/profile/${userId}`
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "get user",
        userId: null,
        value: false
      }
    });

    // Check if user is undefined
    if (!user) {
      const error = new Error("No User found");
      error.type = "error";
      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "get user",
        userId: null,
        value: false
      }
    });

    // Continue if there are no errors
    dispatch({ type: GET_USER, payload: user.user });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/**************************
 * Get current user posts *
 **************************/
export const getPosts = (token, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "get post",
        userId: userId,
        value: true
      }
    });

    const posts = await fetch(`${process.env.REACT_APP_API_URI}/feed/posts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(async res => res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "get post",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (posts.status === 404) {
      const error = new Error(posts.message);
      error.status = posts.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "get post",
        userId: null,
        value: false
      }
    });

    // Dispatch posts to state
    dispatch({ type: GET_FEED_POSTS, payload: posts.posts });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/**********************************
 * Get current user notifications *
 **********************************/
export const getNotifications = (userId, token) => async dispatch => {
  try {
    const notifications = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/notifications/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Check for any errors

    if (notifications.status === 403 || notifications.status === 404) {
      const error = new Error(notifications.message);
      error.status = notifications.status;
      error.type = "error";

      throw error;
    }

    // Continue if there are no errors
    dispatch({ type: GET_NOTIFICATIONS, payload: notifications.notifications });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/************************************
 * Clear current user notifications *
 ************************************/
export const clearNotifications = (userId, token, type) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "clear notifications",
        userId,
        value: true
      }
    });

    const clearNotifications = await fetch(
      `${process.env.REACT_APP_API_URI}/feed/notifications/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type
        })
      }
    ).then(async res => await res.json());

    // Check for any errors
    dispatch({
      type: LOADING,
      payload: {
        type: "clear notifications",
        userId: null,
        value: false
      }
    });

    if (
      clearNotifications.status === 403 ||
      clearNotifications.status === 404
    ) {
      const error = new Error(clearNotifications.message);
      error.status = clearNotifications.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "clear notifications",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/************************************
 * Get current user Friend Requests *
 ************************************/
export const getFriendRequests = token => async dispatch => {
  try {
    const friendRequests = await fetch(
      `${process.env.REACT_APP_API_URI}/user/friend-request`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Check for any errors
    if (friendRequests.status !== 200) {
      const error = new Error(friendRequests.message);
      error.status = friendRequests.status;
      error.type = "success";

      throw error;
    }

    dispatch({ type: GET_FRIEND_REQUESTS, payload: friendRequests.request });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/************************************
 * Clear current user message count *
 ************************************/
export const clearMessageCount = token => async dispatch => {
  try {
    const clearedMessageCount = await fetch(
      `${process.env.REACT_APP_API_URI}/user/message`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    // Check for any errors
    if (clearedMessageCount.status !== 200) {
      const error = new Error(clearedMessageCount.message);
      error.status = clearedMessageCount.status;
      error.typ = "error";

      throw error;
    }
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***********************
 * Send friend request *
 ***********************/
export const sendFriendRequest = (
  userId,
  friendId,
  token
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "send request",
        userId,
        value: true
      }
    });

    const requestSent = await fetch(
      `${process.env.REACT_APP_API_URI}/user/send-friend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          friendId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "send request",
        userId,
        value: false
      }
    });

    // Check for any errors
    if (requestSent.status !== 200) {
      const error = new Error(requestSent.message);
      error.status = requestSent.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "send request",
        userId: null,
        value: false
      }
    });

    return requestSent.friend;
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*************************
 * Cancel friend request *
 *************************/
export const cancelFriendRequest = (
  friendId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "cancel request",
        userId,
        value: true
      }
    });

    const cancelledRequest = await fetch(
      `${process.env.REACT_APP_API_URI}/user/cancel-friend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          friendId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "cancel request",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (cancelledRequest.status !== 200) {
      const error = new Error(cancelledRequest.message);
      error.status = cancelledRequest.status;
      error.type = "error";

      throw error;
    }
    dispatch({
      type: LOADING,
      payload: {
        type: "cancel request",
        userId: null,
        value: false
      }
    });

    return cancelledRequest.friend;
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/******************************
 * Reset friend request count *
 ******************************/
export const resetFriendRequest = (userId, token) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "reset request count",
        userId,
        value: true
      }
    });

    const resetRequest = await fetch(
      `${process.env.REACT_APP_API_URI}/user/friend-request`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId
        })
      }
    ).then(async res => await res.json());

    // Check for any errors

    dispatch({
      type: LOADING,
      payload: {
        type: "reset request count",
        userId: null,
        value: false
      }
    });

    if (resetRequest.status !== 200) {
      const error = new Error(resetRequest.message);
      error.status = resetRequest.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "reset request count",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***********************************
 * Decline / Accept friend request *
 ***********************************/
export const handleFriendRequest = (
  userId,
  requestId,
  token,
  friendId,
  type
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: `${type} request`,
        userId,
        value: true
      }
    });

    let request;

    if (type === "decline") {
      request = await fetch(
        `${process.env.REACT_APP_API_URI}/user/decline-friend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            requestId,
            userId
          })
        }
      ).then(async res => await res.json());
    } else if (type === "accept") {
      request = await fetch(
        `${process.env.REACT_APP_API_URI}:8080/user/accept-friend`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            friendId,
            requestId,
            userId
          })
        }
      ).then(async res => await res.json());
    }

    dispatch({
      type: LOADING,
      payload: {
        type: `${type} request`,
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (request.status !== 200) {
      const error = new Error(request.message);
      error.status = request.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: `${type} request`,
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***************
 * Search user *
 ***************/
export const searchUser = (value, token, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "search user",
        userId,
        value: true
      }
    });

    const users = await fetch(`${process.env.REACT_APP_API_URI}/user/search`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: value })
    }).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "search user",
        userId: null,
        value: false
      }
    });

    return users;
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/************************
 * Get current Messages *
 ************************/
export const getMessages = (userId, token) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "get messages",
        userId,
        value: true
      }
    });

    const messages = await fetch(
      `${process.env.REACT_APP_API_URI}/user/chat/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "get messages",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (messages.status !== 200) {
      const error = new Error(messages.message);
      error.status = messages.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "get messages",
        userId: null,
        value: false
      }
    });

    dispatch({
      type: GET_MESSAGES,
      payload: messages.messages
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/****************
 * Send message *
 ****************/
export const sendMessage = (
  userId,
  friendId,
  message,
  token,
  type,
  props
) => async dispatch => {
  try {
    let sentMessage;

    // Check if there is a message
    if (!message) {
      const error = new Error("Message field cannot be blank");
      error.status = 422;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId,
        value: true
      }
    });

    switch (type) {
      case "single":
        sentMessage = await fetch(
          `${process.env.REACT_APP_API_URI}/user/message`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              friendId,
              message,
              userId
            })
          }
        ).then(async res => await res.json());
        break;

      default:
        return;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (sentMessage.status !== 200) {
      const error = new Error(sentMessage.message);
      error.status = sentMessage.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId: null,
        value: false
      }
    });

    // Redirect back to homepage
    props.history.push("/");
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*******************
 * Get single chat *
 *******************/
export const getChat = (chatId, token, props, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "get message",
        userId,
        value: true
      }
    });

    const chat = await fetch(
      `${process.env.REACT_APP_API_URI}/user/select-chat/${chatId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "get message",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (chat.status !== 200) {
      const error = new Error(chat.message);
      error.status = chat.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "get message",
        userId: null,
        value: false
      }
    });

    dispatch({ type: GET_CHAT, payload: chat.chat });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
    props.history.push("/");
  }
};

/***************************************************************
 * Create message - handles message sending to 1 or more users *
 ***************************************************************/
export const createMessage = (
  recipients,
  message,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId,
        value: true
      }
    });

    const createdMessage = await fetch(
      `${process.env.REACT_APP_API_URI}/user/create-message`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          recipients,
          message
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (createdMessage.status !== 200) {
      const error = new Error(createMessage.message);
      error.status = createdMessage.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "send message",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/**************
 * Leave Chat *
 **************/
export const leaveChat = (
  chatId,
  userItemId,
  token,
  props,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "leave chat",
        userId,
        value: true
      }
    });

    const leavingUser = await fetch(
      `${process.env.REACT_APP_API_URI}/user/message/leave`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId,
          userItemId
        })
      }
    );

    dispatch({
      type: LOADING,
      payload: {
        type: "leave chat",
        userId: null,
        value: false
      }
    });

    // Check if there are any errors
    if (leavingUser.status !== 200) {
      const error = new Error(leavingUser.message);
      error.status = leavingUser.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "leave chat",
        userId: null,
        value: false
      }
    });

    props.history.push("/");
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/********************
 * Add user to chat *
 ********************/
export const addUserToChat = (
  friendId,
  chatId,
  token,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "add to chat",
        userId,
        value: true
      }
    });

    const addedUser = await fetch(
      `${process.env.REACT_APP_API_URI}/user/message/friend`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          friendId,
          chatId
        })
      }
    ).then(async res => await res.json());

    // Check for any errors

    dispatch({
      type: LOADING,
      payload: {
        type: "add to chat",
        userId: null,
        value: false
      }
    });

    if (addedUser.status !== 200) {
      const error = new Error(addedUser.message);
      error.status = addedUser.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "add to chat",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/*****************
 * Remove Friend *
 *****************/
export const removeFriend = (friendId, token, userId) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "remove friend",
        userId,
        value: true
      }
    });

    const removedFriend = await fetch(
      `${process.env.REACT_APP_API_URI}/user/remove-friend`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          friendId
        })
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "remove friend",
        userId: null,
        value: false
      }
    });

    // Check for any errors
    if (removedFriend.status !== 200) {
      const error = new Error(removedFriend.message);
      error.status = removedFriend.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "remove friend",
        userId: null,
        value: false
      }
    });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};

/***********************
 * Update user profile *
 ***********************/
export const updateUserProfile = (
  profileData,
  token,
  props,
  userId
) => async dispatch => {
  try {
    dispatch({
      type: LOADING,
      payload: {
        type: "update profile",
        userId,
        value: true
      }
    });

    const updateProfile = await fetch(
      `${process.env.REACT_APP_API_URI}/profile/details`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      }
    ).then(async res => await res.json());

    dispatch({
      type: LOADING,
      payload: {
        type: "update profile",
        userId: null,
        value: false
      }
    });

    // Check if there any errors
    if (updateProfile.status !== 200) {
      const error = new Error(updateProfile.message);
      error.status = updateProfile.status;
      error.type = "error";

      throw error;
    }

    dispatch({
      type: LOADING,
      payload: {
        type: "update profile",
        userId: null,
        value: false
      }
    });

    props.history.goBack();
  } catch (err) {
    dispatch({ type: INPUT_ERROR, payload: err });
  }
};
