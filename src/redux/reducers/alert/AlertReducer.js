import { SUCCESS, ERROR } from "./AlertConstants";

const initialState = {
  alert: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SUCCESS:
      return {
        ...state,
        alert: action.payload
      };

    case ERROR:
      return {
        ...state,
        alert: action.payload
      };

    default:
      return state;
  }
}
