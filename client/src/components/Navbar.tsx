import React, { FC } from 'react';
import BSNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { Link, navigate } from '@reach/router';
import { useAppDispatch, useAppSelector } from '../store';
import { getUser, logoutUser } from '../store/auth/slice';

export interface INavbarProps {
}

export const Navbar: FC<INavbarProps> = () => {
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  return (
    <div className='navbar-wrapper'>
      <BSNavbar className='navbar'>
        <Container>
          <BSNavbar.Brand as='button' onClick={() => navigate('/')} className='brand'>
            <FontAwesomeIcon icon={faPoll} className='brand-icon' />
            Survey Town
          </BSNavbar.Brand>
          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/surveys'>Surveys</Nav.Link>
            </Nav>
            {user &&
              <BSNavbar.Collapse className="justify-content-end">
                <BSNavbar.Text>
                  {user.handle} | &nbsp;
                  <button className='btn-link logout-button' onClick={() => dispatch(logoutUser())}>
                    Logout
                  </button>
                </BSNavbar.Text>
              </BSNavbar.Collapse>
            }
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </div>
  );
}