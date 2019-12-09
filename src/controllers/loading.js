import { LOADING } from "../redux/reducers/loading/LoadingConstants";

export const loading = value => async dispatch => {
  dispatch({ type: LOADING, payload: value });
};
