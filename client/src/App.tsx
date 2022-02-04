import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { AppState, useAppDispatch, useAppSelector } from './store';
import { login } from './store/auth/slice';

function App() {
  const dispatch = useAppDispatch();

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
        <p>
          <button onClick={() => dispatch(login({ dto: { emailAddress: 'mrryantsmith@gmail.com', plaintextPassword: 'abc' }}))}>
            Login
          </button>
        </p>
      </header>
    </div>
  );
}

export default App;
