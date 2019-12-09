import { OPEN_MODAL, CLOSE_MODAL } from "./ModalConstants";

const initialState = {
  openModal: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        openModal: action.payload
      };

    case CLOSE_MODAL:
      return {
        ...state,
        openModal: action.payload
      };

    default:
      return state;
  }
}
