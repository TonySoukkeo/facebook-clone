export const alert = (type, message) => dispatch => {
  dispatch({ type, payload: message });
};
