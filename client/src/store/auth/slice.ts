import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginDto } from '../../entities/dtos/login.dto';
import { RegisterDto } from '../../entities/dtos/register.dto';
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
    restoreSession() {
      // triggers epic
    },
    registerUser(state: IAuthState, action: PayloadAction<{ dto: RegisterDto }>) {
      // triggers epic
    },
    setUser(state: IAuthState, action: PayloadAction<{ user: User|null }>) {
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
  restoreSession,
  registerUser,
  setUser,
  unsetUser
} = slice.actions;

export const authReducer = slice.reducer;


