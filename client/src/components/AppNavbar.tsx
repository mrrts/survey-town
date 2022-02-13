import React, { FC } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, navigate } from '@reach/router';
import { useAppDispatch, useAppSelector } from '../store';
import { logoutUser } from '../store/auth/slice';
import { getUser } from '../store/auth/selectors';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Spinner } from './common/Spinner';
import { useDelayedRender } from '../util/hooks/useDelayedRender.hook';

export interface IAppNavbarProps {
}

export const AppNavbar: FC<IAppNavbarProps> = () => {
  const showLogin = useDelayedRender(1000).show;
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  return (
    <div className='navbar-wrapper'>
      <Navbar className='navbar' fixed='top' collapseOnSelect expand="lg">
        <Container>
          <Navbar.Brand as='button' onClick={() => navigate('/')} className='brand'>
            <FontAwesomeIcon icon={faPoll} className='brand-icon' />
            Survey Town
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/surveys'>Surveys</Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
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
            </Navbar.Collapse>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}