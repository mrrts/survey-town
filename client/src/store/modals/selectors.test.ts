import { AppState } from '..';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import * as selectors from './selectors';

describe('modal selectors', () => {
  let state = {
    modals: {
      modals: {
        [ModalKeys.TAKE_SURVEY]: {
          isOpen: true,
          data: { a: 'b' }
        }
      }
    }
  } as any as AppState;

  it('getModalsState', () => {
    expect(selectors.getModalsState(state)).toBe(state.modals);
  });

  it('getModalState', () => {
    expect(selectors.getModalState(ModalKeys.TAKE_SURVEY)(state)?.data.a).toBe('b');
    expect(selectors.getModalState(ModalKeys.TAKE_SURVEY)(state)?.isOpen).toBe(true);
  });
});