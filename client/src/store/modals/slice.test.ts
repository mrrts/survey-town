import { ModalKeys } from '../../constants/ModalKeys.enum';
import {
  modalsReducer,
  setModalOpen,
  setModalData,
  IModalsState
} from './slice';

describe('modalsReducer', () => {
  let modalsState: IModalsState;

  beforeEach(() => {
    modalsState = {
      modals: {
        [ModalKeys.SURVEY_GENERAL]: {
          isOpen: false,
          data: { a: 'b' }
        }
      }
    };
  });

  test('setModalOpen', () => {
    const action = setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: true });
    const newState = modalsReducer(modalsState, action);
    expect(newState.modals[ModalKeys.SURVEY_GENERAL].isOpen).toBe(true);
  });

  test('setModalData', () => {
    const action = setModalData({ key: ModalKeys.SURVEY_GENERAL, data: { c: 'd' }});
    expect(modalsState.modals[ModalKeys.SURVEY_GENERAL].data).toEqual({ a: 'b'});
    const newState = modalsReducer(modalsState, action);
    expect(newState.modals[ModalKeys.SURVEY_GENERAL].data).toEqual({ c: 'd' });
  });
});