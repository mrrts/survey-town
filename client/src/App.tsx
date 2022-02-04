import React, { useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import { AppState, useAppDispatch, useAppSelector } from './store';
import { loginUser, logoutUser } from './store/auth/slice';
import { LoginDto } from './entities/dtos/login.dto';
import { useRequest } from './util/hooks/useRequest.hook';

function App() {
  const dispatch = useAppDispatch();
  const userHandle = useAppSelector(state => state.auth.user?.handle);
  const loggedIn = !!userHandle;
  const [emailAddress, setEmailAddress] = useState('');
  const [plaintextPassword, setPlaintextPassword] = useState('');
  const { isPending, error } = useRequest(`login_${emailAddress}`);

  const handleClick = useCallback(() => {
    if (loggedIn) {
      dispatch(logoutUser());
    } else {
      const dto: LoginDto = { emailAddress, plaintextPassword };
      dispatch(loginUser({ dto }));
    }
    setEmailAddress('');
    setPlaintextPassword('');
  }, [loggedIn, dispatch, emailAddress, plaintextPassword]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        { !loggedIn && (
          <div>
            <input type='text' value={emailAddress} onChange={e => setEmailAddress(e.target.value)} />
            <input type='password' value={plaintextPassword} onChange={e => setPlaintextPassword(e.target.value)} />
          </div>
        )}
        { isPending && 'Logging In...' }
        { error && (<p>{error}</p>) }
        <p>
          <button onClick={handleClick}>
            { loggedIn ? `Logout ${userHandle}` : 'Login' }
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
