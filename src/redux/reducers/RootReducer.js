import { combineReducers } from "redux";
import LoadingReducer from "../reducers/loading/LoadingReducer";
import ErrorReducer from "../reducers/error-handling/ErrorReducer";
import AlertReducer from "../reducers/alert/AlertReducer";
import AuthReducer from "../reducers/auth/AuthReducer";
import UserReducer from "../reducers/user/UserReducer";
import PostReducer from "../reducers/post/PostReducer";
import ModalReducer from "../reducers/modal/ModalReducer";
import ChatReducer from "../reducers/chat/ChatReducer";

export default combineReducers({
  loading: LoadingReducer,
  errors: ErrorReducer,
  alert: AlertReducer,
  auth: AuthReducer,
  user: UserReducer,
  post: PostReducer,
  modal: ModalReducer,
  chat: ChatReducer
});
