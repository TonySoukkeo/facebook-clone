import {
  OPEN_MODAL,
  CLOSE_MODAL
} from "../redux/reducers/modal/ModalConstants";

export const openModal = modalContent => dispatch => {
  dispatch({ type: OPEN_MODAL, payload: modalContent });
};

export const closeModal = () => dispatch => {
  dispatch({ type: CLOSE_MODAL, payload: null });
};
