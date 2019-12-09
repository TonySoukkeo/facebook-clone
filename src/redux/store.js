import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./reducers/RootReducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {},
  middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(composeWithDevTools(applyMiddleware(...middleware)))
);

export default store;
