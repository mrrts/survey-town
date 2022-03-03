import React, { useEffect, useRef } from 'react';
import { Router, WindowLocation } from '@reach/router';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Surveys } from './components/surveys/Surveys';
import { Login } from './components/auth/Login';
import { AppNavbar } from './components/AppNavbar';
import { useAppDispatch, useAppSelector } from './store';
import { restoreSession } from './store/auth/slice';
import Container from 'react-bootstrap/Container';
import { Register } from './components/auth/Register';
import { EditSurveyItemsRoute } from './components/surveys/survey-items/EditSurveyItemsRoute';
import { ToastContainer } from 'react-toastify';
import { SurveyGeneralFormModal } from './components/surveys/SurveyGeneralFormModal';
import { TakeSurveyModal } from './components/surveys/take-survey/TakeSurveyModal';
import { Home } from './components/Home';
import { ResultsRoute } from './components/surveys/results/ResultsRoute';
import { OnRouteChange } from './components/common/OnRouteChange';
import cn from 'classnames';
import { getIsDarkMode } from './store/ui/selectors';
import { useDarkMode } from './util/hooks/useDarkMode';

function App() {
  const dispatch = useAppDispatch();
  const appContainerRef = useRef<HTMLDivElement>();
  const env = process.env.NODE_ENV;
  useDarkMode();
  const isDarkMode = useAppSelector(getIsDarkMode);

  const handleRouteChange = (location: WindowLocation) => {
    // jsdom in test env throws typeError that scrollTo is not a function
    env !== 'test' && appContainerRef.current?.scrollTo(0, 0);
  };

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <div className={cn('app-container', { 'dark-mode': isDarkMode })} ref={appContainerRef as any}>
      <h1 className='sr-only'>Survey Town</h1>
      <header className='app-navbar'>
        <AppNavbar />
      </header>
      <main className='main-container'>
        <Container>
          <Router>
            <Home path='/' />
            <Login path='login' />
            <Register path='register' />
            <ProtectedRoute path='surveys'>
              <Surveys path='/' />
              <EditSurveyItemsRoute path=':surveyId/edit' />
              <ResultsRoute path=':surveyId/results' />
            </ProtectedRoute>
          </Router>
        </Container>
      </main>
      <ToastContainer />
      <SurveyGeneralFormModal />
      <TakeSurveyModal />
      <OnRouteChange action={handleRouteChange} />
    </div>
  );
}

export default App;
