import { GET_POST, MODIFY_POST } from "./PostConstants";

const initialState = {
  post: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POST:
      return {
        ...state,
        post: action.payload
      };

    case MODIFY_POST:
      return {
        ...state,
        post: action.payload
      };

    default:
      return state;
  }
}
