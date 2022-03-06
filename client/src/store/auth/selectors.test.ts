import { AppState } from '..';
import * as selectors from './selectors';

describe('auth selectors', () => {

  let state = {
    auth: {
      user: {
        uuid: 'user1'
      }
    }
  } as AppState;
  
  it('getAuth', () => {
    expect(selectors.getAuth(state)).toBe(state.auth);
  });

  it('getUser', () => {
    expect(selectors.getUser(state)?.uuid).toBe('user1');
  });
});