import { LOADING } from "./LoadingConstants";

const initialState = {
  loading: {
    type: "default",
    userId: null,
    value: false
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
}
