import React, { FC } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { keys } from 'lodash';
import { RouteComponentProps } from '@reach/router';
import { useAppDispatch } from '../../store';
import { registerUser } from '../../store/auth/slice';
import { RegisterDto } from '../../entities/dtos/register.dto';
import { RequestInfo } from '../common/RequestInfo';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export interface IRegisterProps extends RouteComponentProps {

}

export const Register: FC<IRegisterProps> = () => {
  const schema = yup.object().shape({
    emailAddress: yup.string().email('Must be a valid email address').required(),
    handle: yup.string().required().min(6).max(20).matches(/^\w+$/, { message: 'must be only letters, numbers, and underscores'}),
    plaintextPassword: yup.string().required().min(8).max(36),
    plaintextPassword2: yup.string().required()
  }).required();

  const dispatch = useAppDispatch();
  const { register, handleSubmit, watch, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(schema),
  });
  const pw1 = watch('plaintextPassword');
  const pw2 = watch('plaintextPassword2');

  const pwsMatch = pw1 === pw2;

  const valid = pwsMatch && keys(errors).length === 0;

  const onSubmit = (data: any) => {
    if (valid) {
      const values = getValues();
      const dto = new RegisterDto({
        emailAddress: values.emailAddress,
        plaintextPassword: values.plaintextPassword,
        handle: values.handle
      });
      dispatch(registerUser({ dto }));
    }
  }
  
  return (
    <div className='register card'>
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId='emailAddress'>
          <Form.Label>*Email Address (private)</Form.Label>
          <Form.Control
            type='email'
            placeholder='email@example.com'
            isInvalid={!!errors?.emailAddress}
            { ...register('emailAddress')}
          ></Form.Control>
          <Form.Text className='text-muted'>We will never share your email with anyone.</Form.Text>
          <p><Form.Text className='text-danger'>{errors.emailAddress?.message}</Form.Text></p>
        </Form.Group>
        <Form.Group controlId='handle'>
          <Form.Label>*User Nickname (public)</Form.Label>
          <Form.Control
            type='text'
            placeholder='ex. SurveyLover123'
            isInvalid={!!errors?.handle}
            { ...register('handle')}
          ></Form.Control>
          <Form.Text className='text-muted'>6-20 characters &em; letters, numbers, and underscores only</Form.Text>
          <p><Form.Text className='text-danger'>{errors.handle?.message}</Form.Text></p>
        </Form.Group>
        <Form.Group controlId='plaintextPassword'>
          <Form.Label>*Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            isInvalid={!!errors?.plaintextPassword}
            { ...register('plaintextPassword') }
          ></Form.Control>
          <Form.Text className='text-muted'>8-36 characters</Form.Text>
          <p><Form.Text className='text-danger'>{errors.plaintextPassword?.message}</Form.Text></p>
        </Form.Group>
        <Form.Group controlId='plaintextPassword2'>
          <Form.Label>*Re-enter Password</Form.Label>
          <Form.Control 
            type='password'
            placeholder='Re-enter password'
            isInvalid={!!errors?.plaintextPassword2 || !pwsMatch}
            { ...register('plaintextPassword2') }
          ></Form.Control>
          {!pwsMatch && (
            <p><Form.Text className='text-danger'>Passwords do not match</Form.Text></p>
          )}
        </Form.Group>
        <Button type='submit' disabled={!valid}>
          Register
        </Button>

        <div>
          <RequestInfo requestKey='register' />
        </div>
      </Form>
    </div>
  );
}