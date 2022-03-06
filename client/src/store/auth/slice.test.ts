import { authReducer, defaultAuthState, IAuthState, setUser, unsetUser } from "./slice";

describe('authReducer', () => {
  let authState: IAuthState;

  beforeEach(() => {
    authState = { ...defaultAuthState };
  });

  test('setUser', () => {
    const action = setUser({ user: { uuid: 'user1' } as any});
    const newState = authReducer(authState, action);
    expect(newState.user).toHaveProperty('uuid', 'user1');
  });

  test('unsetUser', () => {
    authState.user = { uuid: 'user1' } as any;
    const action = unsetUser();
    const newState = authReducer(authState, action);
    expect(newState.user).toBeNull();
  });
});