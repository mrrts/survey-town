import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "..";
import { IUsersState } from "./slice";

export const getUsersState = (state: AppState) => state.users;

export const getUserHandles = createSelector(
  getUsersState,
  (usersState: IUsersState) => usersState.handles
);