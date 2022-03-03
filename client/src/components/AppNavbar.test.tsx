import { AppNavbar } from "./AppNavbar";
import { click, customRender, CustomRenderResult, debug, query, testUser, wait } from '../test-utils';
import { logoutUser } from "../store/auth/slice";

describe('AppNavbar', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {}; // default already has logged-in user

    defaultRender = () => customRender(
      <AppNavbar />,
      initialState,
    );
  });

  it('renders a fixed-top navbar', () => {
    defaultRender();

    expect(query('nav')).toHaveClass('navbar', 'fixed-top');
  });

  it('has a brand button that links to the homepage', async () => {
    defaultRender();

    const brandBtn = () => query('.navbar-brand.brand');

    expect(brandBtn()).toBeInTheDocument();
    expect(brandBtn()?.tagName).toBe('A');
    expect(brandBtn()).toHaveAttribute('href', '/');
    expect(brandBtn()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'poll');
    expect(brandBtn()).toHaveTextContent('Survey Town');
  });

  it('has a link to the surveys route', () => {
    const { getByText } = defaultRender();

    const link = () => getByText('Surveys');

    expect(link()).toBeInTheDocument();
    expect(link()?.tagName).toBe('A');
    expect(link()).toHaveAttribute('href', '/surveys');
  });

  it('shows a dropdown menu for the logged in user, with logout button', () => {
    const { getByText, mockStore } = defaultRender();

    const handle = () => getByText(testUser.handle);
    const logoutBtn = () => query('.logout-button');
    
    expect(handle()).toBeInTheDocument();
    expect(handle().querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'user-circle');

    expect(logoutBtn()).not.toBeInTheDocument();

    click(handle());

    expect(logoutBtn()).toBeInTheDocument();
    expect(logoutBtn()).toHaveTextContent('Logout');
    
    expect(mockStore.dispatch).not.toHaveBeenCalledWith(logoutUser());

    click(logoutBtn());

    expect(mockStore.dispatch).toHaveBeenCalledWith(logoutUser());
  });

  it('shows a spinner, then a login button when logged out', async () => {
    initialState = {
      auth: {
        user: null
      }
    };

    const { getByText } = customRender(
      <AppNavbar />,
      initialState
    );

    const handle = () => getByText(testUser.handle);

    expect(() => handle()).toThrow(); // not in document
    expect(query('.spinner-wrapper')).toBeInTheDocument();
    expect(query('.login-button')).not.toBeInTheDocument();

    await wait(1000);

    expect(query('.spinner-wrapper')).not.toBeInTheDocument();
    expect(query('.login-button')).toBeInTheDocument();

    expect(query('.login-button')).toHaveTextContent('Login');
    expect(query('.login-button')?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'sign-in-alt');
  });
});