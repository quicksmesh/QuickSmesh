import { createSlice } from "@reduxjs/toolkit";

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: {
    connected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});

export const { setConnected } = websocketSlice.actions;
export default websocketSlice.reducer;
