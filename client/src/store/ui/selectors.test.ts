import { AppState } from '..';
import * as selectors from './selectors';

describe('ui selectors', () => {
  let state = {
    ui: {
      darkMode: true
    }
  } as any as AppState;

  test('getUiState', () => {
    expect(selectors.getUiState(state)).toBe(state.ui);
  });

  test('getIsDarkMode', () => {
    expect(selectors.getIsDarkMode(state)).toBe(true);
  });
});