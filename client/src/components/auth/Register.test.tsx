import { Register } from "./Register";
import { click, customRender, debug, query, setFieldValue, wait } from "../../test-utils";
import { registerUser } from "../../store/auth/slice";
import { RequestStatus } from "../../store/requests/slice";

describe('Register', () => {
  let initialState: any = { auth: { user: null }};
  const defaultRender = () => customRender(
    <Register />,
    initialState
  );
  const heading = () => query('h2');
  const emailLabel = () => query('label[for=emailAddress]');
  const emailInput = () => query('input[name=emailAddress]');
  const handleLabel = () => query('label[for=handle]');
  const handleInput = () => query('input[name=handle]');
  const pwLabel = () => query('label[for=plaintextPassword]');
  const pwInput = () => query('input[name=plaintextPassword]');
  const pw2Label = () => query('label[for=plaintextPassword2]');
  const pw2Input = () => query('input[name=plaintextPassword2]');
  const submitBtn = () => query('button[type=submit]');

  it('has a heading', () => {
    defaultRender();
    expect(heading()).toBeInTheDocument();
    expect(heading()).toHaveTextContent('Sign Up');
  });

  it('has email, handle, and pw/pw2 fields', () => {
    defaultRender();

    expect(emailLabel()).toBeInTheDocument();
    expect(emailLabel()).toHaveTextContent('*Email Address (private)');
    expect(emailInput()).toBeInTheDocument();
    expect(emailInput()).toHaveAttribute('placeholder', 'email@example.com');
    expect(emailInput()).toHaveAttribute('type', 'email');
    expect(emailInput()?.nextSibling).toHaveTextContent('We will never share your email with anyone.');
    
    expect(handleLabel()).toBeInTheDocument();
    expect(handleLabel()).toHaveTextContent('*User Nickname (public)');
    expect(handleInput()).toBeInTheDocument();
    expect(handleInput()).toHaveAttribute('placeholder', 'ex. SurveyLover123');
    expect(handleInput()?.nextSibling).toHaveTextContent('6-20 characters — letters, numbers, and underscores only');

    expect(pwLabel()).toBeInTheDocument();
    expect(pwLabel()).toHaveTextContent('*Password');
    expect(pwInput()).toBeInTheDocument();
    expect(pwInput()).toHaveAttribute('placeholder', 'Password');
    expect(pwInput()?.nextSibling).toHaveTextContent('8-36 characters');

    expect(pw2Label()).toBeInTheDocument();
    expect(pw2Label()).toHaveTextContent('*Re-enter Password');
    expect(pw2Input()).toBeInTheDocument();
    expect(pw2Input()).toHaveAttribute('placeholder', 'Re-enter password');
  });

  it('requires the email field to be a valid email', async () => {
    const { mockStore, getByText } = defaultRender();

    setFieldValue(emailInput(), 'not-valid-email');
    setFieldValue(handleInput(), 'valid_handle1');
    setFieldValue(pwInput(), 'password!');
    setFieldValue(pw2Input(), 'password!');

    click(submitBtn());

    await wait(100);

    // debug();

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('Must be a valid email address')).toBeInTheDocument();
  });

  it('requires the handle field to be 6-20 word characters', async () => {
    const { mockStore, getByText } = defaultRender();

    setFieldValue(emailInput(), 'valid-email@email.com');
    setFieldValue(handleInput(), 'bad');
    setFieldValue(pwInput(), 'password!');
    setFieldValue(pw2Input(), 'password!');

    click(submitBtn());

    await wait(100);

    // debug();

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('handle must be at least 6 characters')).toBeInTheDocument();

    setFieldValue(handleInput(), 'too_too_too_too_too_too_too_too_long');
    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('handle must be at most 20 characters')).toBeInTheDocument();

    setFieldValue(handleInput(), 'specialCharacter!');
    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('must be only letters, numbers, and underscores')).toBeInTheDocument();
  });

  it('requires the plaintextPasswordField to be 8-36 characters', async () => {
    const { mockStore, getByText } = defaultRender();

    setFieldValue(emailInput(), 'valid-email@email.com');
    setFieldValue(handleInput(), 'valid_handle');
    setFieldValue(pwInput(), 'pass');
    setFieldValue(pw2Input(), 'pass');

    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('plaintextPassword must be at least 8 characters')).toBeInTheDocument();

    setFieldValue(pwInput(), 'pppppppppppppppppppppppppppppppppppppppp');
    setFieldValue(pw2Input(), 'pppppppppppppppppppppppppppppppppppppppp');
    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('plaintextPassword must be at most 36 characters')).toBeInTheDocument();
  });

  it('requires the passwords to match', async () => {
    const { mockStore, getByText } = defaultRender();

    setFieldValue(emailInput(), 'valid-email@email.com');
    setFieldValue(handleInput(), 'valid_handle');
    setFieldValue(pwInput(), 'password!');
    setFieldValue(pw2Input(), 'password?');
    
    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).not.toHaveBeenCalledWith(registerUser(expect.anything()));
    expect(getByText('Passwords do not match')).toBeInTheDocument();

    setFieldValue(pw2Input(), 'password!');
    await wait(100);

    expect(
      () => getByText('Passwords do not match')
    ).toThrow();
  });

  it('registers a user', async () => {
    const { mockStore } = defaultRender();

    setFieldValue(emailInput(), 'valid-email@email.com');
    setFieldValue(handleInput(), 'valid_handle');
    setFieldValue(pwInput(), 'password!');
    setFieldValue(pw2Input(), 'password!');

    click(submitBtn());
    await wait(100);

    expect(mockStore.dispatch).toHaveBeenCalledWith(registerUser({
      dto: {
        emailAddress: 'valid-email@email.com',
        handle: 'valid_handle',
        plaintextPassword: 'password!'
      }
    }));
  });

  it('shows a spinner while registering', () => {
    initialState = { requests: { requests: { register: { state: RequestStatus.PENDING }}}};
    customRender(
      <Register />,
      initialState
    );

    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });
  
  it('does not show a spinner when not registering', () => {
    initialState = { requests: { requests: {}}};
    customRender(
      <Register />,
      initialState
    );

    expect(query('.spinner-wrapper')).not.toBeInTheDocument();
  });
});