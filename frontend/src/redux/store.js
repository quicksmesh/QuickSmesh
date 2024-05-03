import { configureStore } from "@reduxjs/toolkit";
import processReducer from "./processSlice";
import websocketReducer from "./websocketSlice";
import notificationsReducer from "./notificationsSlice";
import argsReducer from "./ArgsSlice";

export default configureStore({
  reducer: {
    processes: processReducer,
    websocket: websocketReducer,
    notifications: notificationsReducer,
    args: argsReducer,
  },
});
