import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalKeys } from "../../constants/ModalKeys.enum";

export interface IModalState {
  isOpen: boolean;
}

export interface IModalsState {
  modals: Record<string, IModalState>;
}

const defaultModalState: IModalState = {
  isOpen: false
};

export const defaultModalsState: IModalsState = {
  modals: {}
};

const slice = createSlice({
  name: 'modals',
  initialState: defaultModalsState,
  reducers: {
    setModalOpen(state: IModalsState, action: PayloadAction<{ key: ModalKeys, open: boolean }>) {
      state.modals = {
        ...state.modals,
        [action.payload.key]: {
          ...defaultModalState,
          isOpen: action.payload.open
        }
      };
    }
  }
});

export const {
  setModalOpen,
} = slice.actions;

export const modalsReducer = slice.reducer;