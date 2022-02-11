import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalKeys } from "../../constants/ModalKeys.enum";

export interface IModalState {
  isOpen: boolean;
  data: any;
}

export interface IModalsState {
  modals: Record<string, IModalState>;
}

const defaultModalState: IModalState = {
  isOpen: false,
  data: {}
};

export const defaultModalsState: IModalsState = {
  modals: {}
};

const slice = createSlice({
  name: 'modals',
  initialState: defaultModalsState,
  reducers: {
    setModalOpen(state: IModalsState, action: PayloadAction<{ key: ModalKeys, open: boolean }>) {
      state.modals[action.payload.key] = {
        ...(state.modals[action.payload.key] || defaultModalState),
        isOpen: action.payload.open
      };
    },
    setModalData(state: IModalsState, action: PayloadAction<{ key: ModalKeys, data: any }>) {
      state.modals[action.payload.key] = {
        ...(state.modals[action.payload.key] || defaultModalState),
        data: action.payload.data
      }
    }
  }
});

export const {
  setModalOpen,
} = slice.actions;

export const modalsReducer = slice.reducer;