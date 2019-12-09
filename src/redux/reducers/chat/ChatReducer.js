import { SELECTED_USER } from "./ChatConstants";

const initialState = {
  selectedUser: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECTED_USER:
      return {
        ...state,
        selectedUser: action.payload
      };

    default:
      return state;
  }
}
