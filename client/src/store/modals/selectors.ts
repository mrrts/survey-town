import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '..';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { IModalsState, IModalState } from './slice';

export const getModalsState = (state: AppState) => state.modals;

export const getModalState = (key: ModalKeys) => createSelector(
  getModalsState,
  (modalsState: IModalsState): IModalState => modalsState.modals[key]
);
