import { configureStore } from "@reduxjs/toolkit";
import backendStatusReducer from "./reducers/backendStatus";
import globalValuesReducer from "./reducers/globalValues"
import userStatusReducer from "./reducers/userStatus";

const store = configureStore({
  reducer: {
    backendStatus: backendStatusReducer,
    userStatus: userStatusReducer,
    globalValues: globalValuesReducer
  }
});

export default store;