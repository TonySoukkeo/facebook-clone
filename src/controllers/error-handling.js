import { INPUT_ERROR } from "../redux/reducers/error-handling/ErrorConstants";

export const error = value => dispatch => {
  dispatch({ type: INPUT_ERROR, payload: value });
};
