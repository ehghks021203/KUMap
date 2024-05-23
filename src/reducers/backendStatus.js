import { createSlice } from '@reduxjs/toolkit';

const backendStatusSlice = createSlice({
  name: 'backendStatus',
  initialState: {
    isUp: true
  },
  reducers: {
    setBackendStatus: (state, action) => {
      state.isUp = action.payload;
    }
  }
});

export const { setBackendStatus } = backendStatusSlice.actions;
export default backendStatusSlice.reducer;