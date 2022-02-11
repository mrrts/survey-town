import { useMemo } from "react";
import { ModalKeys } from "../../constants/ModalKeys.enum";
import { useAppDispatch, useAppSelector } from "../../store";
import { getModalState } from "../../store/modals/selectors";
import { IModalState, setModalOpen, setModalData } from "../../store/modals/slice";

export interface ModalOps {
  openModal: () => void;
  closeModal: () => void;
  setData: (data: any) => void;
  clearData: () => void;
}

export const useModal = (modalKey: ModalKeys): IModalState & ModalOps => {
  const dispatch = useAppDispatch();

  const selector = useMemo(() => {
    return getModalState(modalKey);
  }, [modalKey]);

  const modalState = useAppSelector(selector);

  const openModal = () => dispatch(setModalOpen({ key: modalKey, open: true }));
  const closeModal = () => dispatch(setModalOpen({ key: modalKey, open: false }));
  const setData = (data: any) => dispatch(setModalData({ key: modalKey, data }));
  const clearData = () => dispatch(setModalData({ key: modalKey, data: {} }));

  return {
    ...modalState,
    openModal,
    closeModal,
    setData,
    clearData
  };
}