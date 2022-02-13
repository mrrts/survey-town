import { RouteComponentProps, navigate, Link } from '@reach/router';
import React, { FC, MouseEvent, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../store/auth/slice';
import { getUser } from '../../store/auth/selectors';
import { RequestInfo } from '../common/RequestInfo';
import { Spinner } from '../common/Spinner';
import { useDelayedRender } from '../../util/hooks/useDelayedRender.hook';

export interface ILoginProps extends RouteComponentProps {

}

export const Login: FC<ILoginProps> = () => {
  const showForm = useDelayedRender(1000).show;
  const dispatch = useAppDispatch();
  const { register, getValues } = useForm();
  const user = useAppSelector(getUser);

  const handleLoginClick = (e: MouseEvent) => {
    e.preventDefault();
    const { emailAddress, plaintextPassword } = getValues();
    dispatch(loginUser({ dto: { emailAddress, plaintextPassword }}));
  }

  useEffect(() => {
    if (user) {
      navigate('/surveys');
    }
  }, [user]);

  if (!showForm) {
    return (
      <Spinner />
    );
  }

  return (
    <div className='login animate__animated animate__fadeIn'>
      <h2>Login</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" { ...register('emailAddress') } />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" { ...register('plaintextPassword') } />
        </Form.Group>

        <RequestInfo requestKey='login' />
        
        <Button variant="primary" type="submit" onClick={handleLoginClick}>
          Login
        </Button>

        <Link className='register-link btn btn-link' to='/register'>
          Sign Up
        </Link>
      </Form>
    </div>
  );
}