import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "..";
import { IAuthState } from "./slice";

/* Selectors*/
export const getAuth = (state: AppState) => state.auth;

export const getUser = createSelector(
  getAuth,
  (auth: IAuthState) => auth.user
);