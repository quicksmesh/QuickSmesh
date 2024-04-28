import { createSlice } from "@reduxjs/toolkit";

export const processSlice = createSlice({
  name: "processes",
  /** Example
  [{
      "pid": 1234
      "tag": "go-spacemesh"
      "args": "go-spacemesh.exe --stuff"
      "stdout": "logs"
    },
    {
      "pid" 9876
      "tag": "go-service"
      "args": "go-service.exe --stuff"
      "stdout": "logs"
    }
  ]
  */
  initialState: {
    active: [],
    hidden: [],
  },
  reducers: {
    updateProcesses: (state, action) => {
      if (action.payload.length === 0) {
        state.active = action.payload;
      } else {
        Object.assign(state.active, action.payload);
      }
    },
    hideProcess: (state, action) => {
      const pid = action.payload;
      state.hidden.push(pid);
    },
  },
});

export const { updateProcesses, hideProcess } = processSlice.actions;
export default processSlice.reducer;
