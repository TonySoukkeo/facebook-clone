import { LOGIN, SET_USER_ID, SET_TOKEN } from "./AuthConstants";

const initialState = {
  isAuth: false,
  userId: null,
  token: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuth: action.payload
      };

    case SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      };

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };

    default:
      return state;
  }
}
