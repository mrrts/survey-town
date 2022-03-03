import { RouteComponentProps, Link, Redirect } from '@reach/router';
import React, { FC } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../../store';
import { useForm } from 'react-hook-form';
import { loginUser } from '../../store/auth/slice';
import { getUser } from '../../store/auth/selectors';
import { RequestInfo } from '../common/RequestInfo';
import { Spinner } from '../common/Spinner';
import { useDelayedRender } from '../../util/hooks/useDelayedRender.hook';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface ILoginProps extends RouteComponentProps {

}

export const Login: FC<ILoginProps> = () => {
  const showForm = useDelayedRender(1000).show;
  const dispatch = useAppDispatch();

  const schema = yup.object().shape({
    emailAddress: yup.string().email().required(),
    plaintextPassword: yup.string().required()
  }).required();

  const { register, getValues, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });
  const user = useAppSelector(getUser);

  const onSubmit = (data: any) => {
    const { emailAddress, plaintextPassword } = getValues();
    dispatch(loginUser({ dto: { emailAddress, plaintextPassword }}));
  }

  if (user) {
    return (
      <Redirect to='/surveys' noThrow />
    );
  }

  if (!showForm) {
    return (
      <Spinner />
    );
  }

  return (
    <div className='login card animate__animated animate__fadeIn'>
      <h2>Login</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="emailAddress">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" { ...register('emailAddress') } />
          <p className='text-danger'>{errors.emailAddress?.message}</p>
        </Form.Group>

        <Form.Group className="mb-3" controlId="plaintextPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" { ...register('plaintextPassword') } />
          <p className='text-danger'>{errors.plaintextPassword?.message}</p>
        </Form.Group>

        <RequestInfo requestKey='login' />
        
        <Button variant="primary" type="submit">
          Login
        </Button>

        <Link className='register-link btn btn-link' to='/register'>
          Sign Up
        </Link>
      </Form>
    </div>
  );
}