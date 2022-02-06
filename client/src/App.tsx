import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Surveys } from './components/Surveys';
import { Login } from './components/Login';
import { Survey } from './components/Survey';
import { Navbar } from './components/Navbar';
import { useAppDispatch } from './store';
import { restoreSession } from './store/auth/slice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className='app-container'>
      <header className='app-navbar'>
        <Navbar />
      </header>
      <main className='main-container'>
        <Router>
          <Login path='login' />
          <ProtectedRoute path='surveys'>
            <Surveys path='/'>
              <Survey path=':surveyId' />
            </Surveys>
          </ProtectedRoute>
        </Router>
      </main>
    </div>
  );
}

export default App;
