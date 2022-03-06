import {
  uiReducer,
  setDarkMode,
  IUIState,
  defaultUiState
} from './slice';

describe('ui reducer', () => {
  let state: IUIState;

  beforeEach(() => {
    state = { ...defaultUiState };
  });

  test('setDarkMode', () => {
    expect(state.darkMode).toBe(false);

    const action = setDarkMode({ darkMode: true });
    const newState = uiReducer(state, action);

    expect(newState.darkMode).toBe(true);
  });
});