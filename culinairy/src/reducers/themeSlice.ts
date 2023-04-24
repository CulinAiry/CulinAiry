import { createSlice } from '@reduxjs/toolkit';

interface themeState {
  isDarkTheme: boolean,
}
const initialState: themeState = {
  isDarkTheme: false,
};

export const themeSlice = createSlice({
  name: 'darkTheme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
  },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
