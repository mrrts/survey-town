import {
  usersReducer,
  receiveHandles,
  IUsersState,
  defaultUsersState
} from './slice';

describe('users reducer', () => {
  let state: IUsersState;
  
  beforeEach(() => {
    state = { ...defaultUsersState };
  });

  test('receiveHandles', () => {
    const handles = [
      { uuid: 'user1', handle: 'Handle_1' },
      { uuid: 'user2', handle: 'Handle_2' },
    ] as any;

    const action = receiveHandles({ handles });
    const newState = usersReducer(state, action);

    expect(newState.handles).toEqual({
      user1: { uuid: 'user1', handle: 'Handle_1' },
      user2: { uuid: 'user2', handle: 'Handle_2' },
    });
  });
});