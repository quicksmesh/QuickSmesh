import { createSlice } from "@reduxjs/toolkit";

import { GoSpacemeshDefaultArgs, ServiceDefaultArgs } from "../DefaultArgs"; // Adjust the path as necessary

export const argsSlice = createSlice({
  name: "args",
  initialState: {
    "go-spacemesh": GoSpacemeshDefaultArgs,
    service: ServiceDefaultArgs,
  },
  reducers: {
    setArg: (state, action) => {
      const { tag, arg, value } = action.payload;
      if (state[tag]) {
        state[tag][arg].value = value;
      }
    },
  },
});

export const { setArg } = argsSlice.actions;

export default argsSlice.reducer;
