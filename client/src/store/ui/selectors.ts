import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "..";
import { IUIState } from "./slice";

export const getUiState = (state: AppState) => state.ui;

export const getIsDarkMode = createSelector(
  getUiState,
  (uiState: IUIState) => !!uiState.darkMode
);