import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../entities/user.model";
import { keyBy } from 'lodash';

export interface IUsersState {
  handles: Record<string, Partial<IUser>>;
}

export const defaultUsersState: IUsersState = {
  handles: {}
};

export const slice = createSlice({
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
