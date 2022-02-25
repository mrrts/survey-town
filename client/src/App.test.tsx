import App from './App';
import { customRender } from './test-utils';
import { restoreSession } from './store/auth/slice';

describe('App', () => {
  const defaultRender = () => customRender(<App />);

  it('restores the active session', () => {
    const { mockStore } = defaultRender();
    expect(mockStore.dispatch).toHaveBeenCalledWith(restoreSession());
  });

  it('has an h1 with the app title for screen readers', () => {
    defaultRender();

    const h1s = document.querySelectorAll('h1');

    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent('Survey Town');
    expect(h1s[0]).toHaveClass('sr-only');
  });

  it('renders a navbar', () => {
    defaultRender();

    const navbar = document.querySelector('header.app-navbar .navbar');
    expect(navbar).toBeTruthy();
  });

  it('renders a main container', () => {
    defaultRender();

    const main = document.querySelector('main.main-container');
    expect(main).toBeTruthy();
  });

  it('renders a container for toast messages', () => {
    defaultRender();

    const toastContainer = document.querySelector('.Toastify');
    expect(toastContainer).toBeTruthy();
  });
});
