import {
  GET_USER,
  GET_FEED_POSTS,
  GET_NOTIFICATIONS,
  GET_MESSAGES,
  GET_CHAT,
  MODIFY_POSTS,
  CHANGE_PRIVACY,
  DELETE_POST,
  GET_FRIEND_REQUESTS
} from "./UserConstants";

const initialState = {
  currentUser: null,
  feedPosts: [],
  notifications: {},
  friendRequest: null,
  messages: [],
  chat: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        currentUser: action.payload
      };

    case GET_FEED_POSTS:
      return {
        ...state,
        feedPosts: action.payload
      };

    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      };

    case GET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };

    case GET_FRIEND_REQUESTS:
      return {
        ...state,
        friendRequest: action.payload
      };

    case GET_CHAT:
      return {
        ...state,
        chat: action.payload
      };

    case DELETE_POST:
      return {
        ...state,
        feedPosts: state.feedPosts.filter(post => post._id !== action.payload)
      };

    case CHANGE_PRIVACY:
      return {
        ...state,
        post: state.feedPosts.map(post => {
          if (post._id === action.payload.postId) {
            post.privacy = action.payload.privacy;
            return post;
          }
          return post;
        })
      };

    case MODIFY_POSTS:
      return {
        ...state,
        feedPosts: state.feedPosts.map(post => {
          if (post._id === action.payload._id) {
            return action.payload;
          }

          return post;
        })
      };

    default:
      return state;
  }
}
