import { configureStore } from "@reduxjs/toolkit";
import processReducer from "./processSlice";
import websocketReducer from "./webscoketSlice";

export default configureStore({
  reducer: {
    processes: processReducer,
    websocket: websocketReducer,
  },
});
