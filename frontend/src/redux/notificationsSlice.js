import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    createNotification: (state, action) => {
      state.push(action.payload);
    },
    removeNotificationByIndex(state, action) {
      const index = action.payload;
      state.splice(index, 1);
    },
  },
});

export const { createNotification, removeNotificationByIndex } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
