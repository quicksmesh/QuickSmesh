import { createSlice } from "@reduxjs/toolkit";

export const processSlice = createSlice({
  name: "processes",
  /** Example
  [{
      "pid": 1234
      "cmd": "go-spacemesh.exe --stuff",
      "tag": "Spacemesh node",
      "stdout": "logs...",
      "ended": true
    },
    {
      "pid" 9876
      "cmd": "go-service.exe --stuff",
      "tag": "PoST Service",
      "stdout": "logs...",
      "ended": false
    }
  ]
  */
  initialState: [],
  reducers: {
    updateProcesses: (state, action) => {
      // Action payload always contains list of current processes
      return action.payload;
    },
  },
});

export const { updateProcesses } = processSlice.actions;
export default processSlice.reducer;
