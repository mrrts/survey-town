import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
    login(state: IAuthState, action: PayloadAction<{ dto: LoginDto }>) {
      // only triggers epic
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
  login,
  setUser,
  unsetUser
} = slice.actions;

export const authReducer = slice.reducer;