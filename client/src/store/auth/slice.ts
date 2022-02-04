import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from '..';
import { LoginDto } from '../../entities/dtos/login.dto';
import { User } from '../../entities/user.model';

export interface IAuthState {
  user: User|null;
}

export const defaultAuthState: IAuthState = {
  user: null,
};

const slice = createSlice({
  name: 'auth',
  initialState: defaultAuthState,
  reducers: {
    loginUser(state: IAuthState, action: PayloadAction<{ dto: LoginDto }>) {
      // triggers epic
    },
    logoutUser() {
      // triggers epic
    },
    setUser(state: IAuthState, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
    },
    unsetUser(state: IAuthState) {
      state.user = null;
    }
  }
});

export const {
  loginUser,
  logoutUser,
  setUser,
  unsetUser
} = slice.actions;

export const authReducer = slice.reducer;

/* Selectors*/
export const getAuth = (state: AppState) => state.auth;

export const getUser = createSelector(
  getAuth,
  (auth: IAuthState) => auth.user
);
