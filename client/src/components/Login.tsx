import { RouteComponentProps, navigate } from '@reach/router';
import React, { FC, MouseEvent, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../store';
import { useForm } from 'react-hook-form';
import { loginUser, getUser } from '../store/auth/slice';

export interface ILoginProps extends RouteComponentProps {

}

export const Login: FC<ILoginProps> = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const user = useAppSelector(getUser);

  const handleLoginClick = (e: MouseEvent) => {
    e.preventDefault();
    dispatch(loginUser({ dto: { emailAddress: email, plaintextPassword: pw }}));
  }

  useEffect(() => {
    if (user) {
      console.log({ user })
      navigate('/surveys');
    }
  }, [user]);

  return (
    <div className='login'>
      <h2>Login</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} />
        </Form.Group>
        
        <Button variant="primary" type="submit" onClick={handleLoginClick}>
          Login
        </Button>
      </Form>
    </div>
  );
}