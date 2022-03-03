import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUIState {
  darkMode: boolean;
}

export const defaultUiState: IUIState = {
  darkMode: false
};

export const slice = createSlice({
  name: 'ui',
  initialState: defaultUiState,
  reducers: {
    setDarkMode(state: IUIState, action: PayloadAction<{ darkMode: boolean }>) {
      state.darkMode = action.payload.darkMode;
    },
  }
});


export const uiReducer = slice.reducer;

export const {
  setDarkMode
} = slice.actions;