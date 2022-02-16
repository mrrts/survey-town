import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Surveys } from './components/surveys/Surveys';
import { Login } from './components/auth/Login';
import { AppNavbar } from './components/AppNavbar';
import { useAppDispatch } from './store';
import { restoreSession } from './store/auth/slice';
import Container from 'react-bootstrap/Container';
import { Register } from './components/auth/Register';
import { EditSurveyItemsRoute } from './components/surveys/EditSurveyItemsRoute';
import { ToastContainer } from 'react-toastify';
import { SurveyGeneralFormModal } from './components/surveys/SurveyGeneralFormModal';
import { TakeSurveyModal } from './components/surveys/take-survey/TakeSurveyModal';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className='app-container'>
      <header className='app-navbar'>
        <AppNavbar />
      </header>
      <main className='main-container'>
        <Container>
          <Router primary={false}>
            <Login path='login' />
            <Register path='register' />
            <ProtectedRoute path='surveys'>
              <Surveys path='/' />
              <EditSurveyItemsRoute path=':surveyId/edit' />
            </ProtectedRoute>
          </Router>
        </Container>
      </main>
      <ToastContainer />
      <SurveyGeneralFormModal />
      <TakeSurveyModal />
    </div>
  );
}

export default App;
