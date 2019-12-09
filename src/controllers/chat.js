import { SELECTED_USER } from "../redux/reducers/chat/ChatConstants";
import { ERROR as ALERT_ERROR } from "../redux/reducers/alert/AlertConstants";

export const selectUser = friendData => dispatch => {
  try {
    dispatch({ type: SELECTED_USER, payload: friendData });
  } catch (err) {
    dispatch({ type: ALERT_ERROR, payload: err });
  }
};
