import React, { FC, useCallback } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll, faUserCircle, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@reach/router';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutUser } from '../store/auth/slice';
import { getUser } from '../store/auth/selectors';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from './common/Spinner';
import { useDelayedRender } from '../util/hooks/useDelayedRender.hook';
import Switch from 'react-switch';
import { setDarkMode } from '../store/ui/slice';
import { getIsDarkMode } from '../store/ui/selectors';

export interface IAppNavbarProps {
}

export const AppNavbar: FC<IAppNavbarProps> = () => {
  const showLogin = useDelayedRender(1000).show;
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector(getIsDarkMode);

  const handleDarkModeChange = useCallback((checked: boolean) => {
    dispatch(setDarkMode({ darkMode: !!checked }));
  }, [dispatch]);

  return (
    <div className='navbar-wrapper'>
      <Navbar className='navbar' fixed='top' variant={isDarkMode ? 'dark' : 'light'} collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand as='a' href='/' className='brand'>
            <FontAwesomeIcon icon={faPoll} className='brand-icon' />
            Survey Town
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Item>
                <Nav.Link as={Link} to='/surveys'>Surveys</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav className='justify-content-end'>
              <Nav.Item className='dark-mode-switch-container'>
                <Switch
                  className='dark-mode-switch'
                  checked={isDarkMode}
                  onChange={handleDarkModeChange}
                  checkedIcon={<FontAwesomeIcon icon={faMoon} />}
                  uncheckedIcon={<FontAwesomeIcon icon={faSun} />}
                  offColor='#ccc'
                  onColor='#ccc'
                  height={20}
                  width={45}
                  aria-label={`dark mode is ${isDarkMode ?  'on' : 'off'}`}
                />
              </Nav.Item>
              {user && (
                <>
                  <NavDropdown
                    title={
                      <>
                        {user.handle}
                        <FontAwesomeIcon className='user-icon' icon={faUserCircle} />
                      </>
                    }
                  >
                    <NavDropdown.Item
                      as='button'
                      className='logout-button'
                      onClick={() => dispatch(logoutUser())}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {!user && !showLogin && (
                <Spinner />
              )}
              {!user && showLogin && (
                <Link className='btn btn-sm btn-primary login-button' to='/login'>
                  Login
                  <FontAwesomeIcon icon={faSignInAlt} />
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}