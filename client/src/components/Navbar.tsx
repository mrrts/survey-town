import React, { FC } from 'react';
import BSNavbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCity } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@reach/router';
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
          <BSNavbar.Brand href="/" className='brand'>
            <FontAwesomeIcon icon={faCity} className='brand-icon' />
            Survey Town
          </BSNavbar.Brand>
          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/surveys'>Surveys</Nav.Link>
              {!user && (
                <Nav.Link as={Link} to='/login'>Login</Nav.Link>
              )}
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            {user &&
              <BSNavbar.Collapse className="justify-content-end">
                <BSNavbar.Text>
                  {user.handle} | &nbsp;
                  <a className='btn-link logout-button' onClick={() => dispatch(logoutUser())}>Logout</a>
                </BSNavbar.Text>
              </BSNavbar.Collapse>
            }
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </div>
  );
}