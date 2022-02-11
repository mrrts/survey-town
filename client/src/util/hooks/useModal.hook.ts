import { useMemo } from "react";
import { AnyAction } from "redux";
import { ModalKeys } from "../../constants/ModalKeys.enum";
import { useAppDispatch, useAppSelector } from "../../store";
import { getModalState } from "../../store/modals/selectors";
import { IModalState, setModalOpen } from "../../store/modals/slice";

export interface ModalOps {
  openModal: () => AnyAction;
  closeModal: () => AnyAction;
  setModalData: (data: any) => AnyAction;
}

export const useModal = (modalKey: ModalKeys): IModalState & ModalOps => {
  const dispatch = useAppDispatch();

  const selector = useMemo(() => {
    return getModalState(modalKey);
  }, [modalKey]);

  const modalState = useAppSelector(selector);

  const openModal = () => dispatch(setModalOpen({ key: modalKey, open: true }));
  const closeModal = () => dispatch(setModalOpen({ key: modalKey, open: false }));
  const setModalData = (data: any): AnyAction => dispatch(setModalData({ key: modalKey, data }));

  return {
    ...modalState,
    openModal,
    closeModal,
    setModalData
  };
}