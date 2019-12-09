import { INPUT_ERROR } from "./ErrorConstants";

const initialState = {
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INPUT_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
}
