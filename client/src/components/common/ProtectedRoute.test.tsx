import { customRender, defaultTestAppState, query, wait } from '../../test-utils';
import { ProtectedRoute } from './ProtectedRoute';

describe('ProtectedRoute', () => {
  let defaultRender: any;

  beforeEach(() => {
    defaultRender = () => customRender(
      <ProtectedRoute>
        <div className='protected-child' />
      </ProtectedRoute>,
      defaultTestAppState,
      '/'
    );
  });

  it('shows the child components if the user is logged in', () => {
    defaultRender();

    expect(query('.protected-child')).toBeInTheDocument();
  });

  it('redirects to login if the user is not logged in', async () => {
    const initialState = { auth: { user: null }};

    const { history } = customRender(
      <ProtectedRoute>
        <div className='protected-child' />
      </ProtectedRoute>,
      initialState,
      '/'
    );

    await wait(100);

    expect(query('.protected-child')).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/login');
  })
});