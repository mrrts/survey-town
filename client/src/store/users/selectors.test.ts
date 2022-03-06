import { AppState } from '..';
import * as selectors from './selectors';

describe('User selectors', () => {
  let state: any;

  beforeEach(() => {
    state = {
      users: {
        handles: {
          user1: { uuid: 'user1', handle: 'Handle_1' },
          user2: { uuid: 'user2', handle: 'Handle_2' }
        }
      }
    } as any as AppState;
  });

  test('getUsersState', () => {
    expect(selectors.getUsersState(state)).toBe(state.users);
  });

  test('getUserHandles', () => {
    expect(selectors.getUserHandles(state)).toBe(state.users.handles);
  });

});