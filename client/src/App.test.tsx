import App from './App';
import { customRender, query, queryAll, testUser, wait } from './test-utils';
import { restoreSession } from './store/auth/slice';
import { ISurvey } from './entities/survey.model';
import { act } from 'react-dom/test-utils';

describe('App', () => {
  const defaultRender = () => customRender(<App />);

  it('restores the active session', () => {
    const { mockStore } = defaultRender();
    expect(mockStore.dispatch).toHaveBeenCalledWith(restoreSession());
  });

  it('has an h1 with the app title for screen readers', () => {
    defaultRender();

    const h1s = queryAll('h1');

    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Survey Town');
    expect(h1s[0]).toHaveClass('sr-only');
  });

  it('renders a navbar', () => {
    defaultRender();

    const navbar = query('header.app-navbar .navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('renders a main container', () => {
    defaultRender();

    const main = query('main.main-container');
    expect(main).toBeInTheDocument();
  });

  it('renders a container for toast messages', () => {
    defaultRender();

    const toastContainer = query('.Toastify');
    expect(toastContainer).toBeInTheDocument();
  });

  it('shows the correct content at the configured routes', async () => {
    const initialState = {
      surveys: {
        // user must be owner in order for edit-survey not to redirect
        surveys: { 1: { uuid: '1', author: testUser.uuid, createdAt: new Date() } as ISurvey }
      }
    }
    const { history } = customRender(
      <App />,
      initialState as any,
      '/'
    );

    const home = () => query('.home-container');
    const surveys = () => query('.surveys');
    const editSurvey = () => query('.edit-survey-items-route');
    const results = () => query('.results-container');

    expect(home()).toBeInTheDocument();

    await history.navigate('/surveys');
    await wait(1000);

    expect(home()).toBeFalsy();
    expect(surveys()).toBeInTheDocument();

    await history.navigate('/surveys/1/edit');

    expect(surveys()).toBeFalsy();
    expect(editSurvey()).toBeInTheDocument();

    await history.navigate('/surveys/1/results');

    expect(editSurvey()).toBeFalsy();
    expect(results()).toBeInTheDocument();
  });

  it('shows the correct auth routes when logged out', async () => {
    const initialState = {
      auth: { user: null }
    };

    const { history } = customRender(
      <App />,
      initialState as any,
      '/login'
    );

    const login = () => query('.login');
    const register = () => query('.register');

    expect(login()).toBeFalsy();
    expect(query('.spinner-wrapper')).toBeInTheDocument();

    await wait(1000);

    expect(login()).toBeInTheDocument();

    await history.navigate('/register');

    expect(login()).toBeFalsy();
    expect(register()).toBeInTheDocument();
  });
});
