import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../entities/user.model";
import { keyBy } from 'lodash';
import { AppState } from "..";

export interface IUsersState {
  handles: Record<string, Partial<IUser>>;
}

const defaultUsersState: IUsersState = {
  handles: {}
};

const slice = createSlice({
  name: 'users',
  initialState: defaultUsersState,
  reducers: {
    fetchUserHandles() {
      // triggers epic
    },
    receiveHandles(state: IUsersState, action: PayloadAction<{ handles: Partial<IUser>[]}>) {
      state.handles = {
        ...state.handles,
        ...keyBy(action.payload.handles, 'uuid')
      };
    }
  }
});

export const {
  fetchUserHandles,
  receiveHandles
} = slice.actions;

export const usersReducer = slice.reducer;

// Selectors

export const getUsersState = (state: AppState) => state.users;

export const getUserHandles = createSelector(
  getUsersState,
  (usersState: IUsersState) => usersState.handles
);