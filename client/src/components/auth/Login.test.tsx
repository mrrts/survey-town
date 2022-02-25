import { fireEvent, screen } from "@testing-library/react";
import { loginUser } from "../../store/auth/slice";
import { click, customRender, debug, query, setFieldValue, testUser, wait } from "../../test-utils";
import { Login } from "./Login";

describe('Login', () => {
  let initialState = {
    auth: { user: null }
  };
  const defaultRender = () => customRender(
    <Login />,
    initialState,
    '/login'
  );
  const spinner = () => query('.spinner-wrapper');
  const heading = () => query('h2');
  const login = () => query('.login');
  const emailLabel = () => query('label[for=emailAddress]');
  const emailInput = () => query('input[name=emailAddress]');
  const pwLabel = () => query('label[for=plaintextPassword]');
  const pwInput = () => query('input[name=plaintextPassword]');
  const submitBtn = () => query('button[type=submit]');
  const registerLink = () => query('a.register-link');

  it('shows a spinner for one second before showing login UI', async () => {
    defaultRender();

    expect(spinner()).toBeInTheDocument();
    expect(login()).toBeFalsy();

    await wait(900);

    expect(spinner()).toBeInTheDocument();
    expect(login()).toBeFalsy();

    await wait(100);

    expect(spinner()).toBeFalsy();
    expect(login()).toBeInTheDocument();
  });

  it('fades in', async () => {
    defaultRender();
    await wait(1001);

    expect(login()).toHaveClass('animate__animated');
    expect(login()).toHaveClass('animate__fadeIn');
  });

  it('has a heading', async () => {
    defaultRender();
    await wait(1001);

    expect(heading()).toBeInTheDocument();
    expect(heading()).toHaveTextContent('Login');
  });

  it('has an email field', async () => {
    defaultRender();
    await wait(1001);

    expect(emailLabel()).toBeInTheDocument();
    expect(emailLabel()).toHaveTextContent('Email address');

    expect(emailInput()).toBeInTheDocument();
    expect(emailInput()).toHaveAttribute('placeholder', 'Enter email');
  });

  it('has a password field', async () => {
    defaultRender();
    await wait(1001);

    expect(pwLabel()).toBeInTheDocument();
    expect(pwLabel()).toHaveTextContent('Password');

    expect(pwInput()).toBeInTheDocument();
    expect(pwInput()).toHaveAttribute('placeholder', 'Password');
  });

  it('has a submit button and register link', async () => {
    defaultRender();
    await wait(1001);

    expect(submitBtn()).toBeInTheDocument();
    expect(submitBtn()).toHaveTextContent('Login');
    expect(submitBtn()).toHaveClass('btn-primary');

    expect(registerLink()).toBeInTheDocument();
    expect(registerLink()?.tagName).toBe('A');
    expect(registerLink()).toHaveAttribute('href', '/register');
    expect(registerLink()).toHaveTextContent('Sign Up');
  });

  it('logs in a user', async () => {
    const { mockStore } = defaultRender();
    await wait(1001);

    setFieldValue(emailInput(), testUser.emailAddress);
    setFieldValue(pwInput(), 'p@ssw0rd!');

    click(submitBtn());

    await wait(100);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      loginUser({ dto: { emailAddress: testUser.emailAddress, plaintextPassword: 'p@ssw0rd!' }})
    );
  });

  it('should require a valid email address and prevent submission', async () => {
    const { mockStore } = defaultRender();
    await wait(1001);

    setFieldValue(emailInput(), 'not_an_email');
    setFieldValue(pwInput(), 'p@ssw0rd!');

    click(submitBtn());

    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(loginUser(expect.anything()));
    expect(screen.getByText('emailAddress must be a valid email')).toBeInTheDocument();
  });

  it('should require a password and prevent submission', async () => {
    const { mockStore } = defaultRender();
    await wait(1001);

    setFieldValue(emailInput(), 'not_an_email');
    setFieldValue(pwInput(), '');

    click(submitBtn());

    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(loginUser(expect.anything()));
    expect(screen.getByText('plaintextPassword is a required field')).toBeInTheDocument();
  });

  it('redirects to /surveys if already logged in', async () => {
    const state = { auth: { user: testUser }};

    const { history } = customRender(
      <Login />,
      state,
      '/login'
    );

    await wait(100);

    expect(history.location.pathname).toBe('/surveys');
  });


});