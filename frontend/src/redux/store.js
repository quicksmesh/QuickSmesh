import { configureStore } from "@reduxjs/toolkit";
import processReducer from "./processSlice";
import websocketReducer from "./websocketSlice";
import notificationsReducer from "./notificationsSlice";

export default configureStore({
  reducer: {
    processes: processReducer,
    websocket: websocketReducer,
    notifications: notificationsReducer,
  },
});
