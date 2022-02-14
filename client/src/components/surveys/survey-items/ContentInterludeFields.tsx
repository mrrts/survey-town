import React, { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import Form from 'react-bootstrap/Form'

interface IContentInterludeFieldsProps {
  register: UseFormRegister<any>;
  errors: { [x: string]: any };
}

export const ContentInterludeFields: FC<IContentInterludeFieldsProps> = ({ register, errors }) => {
  return (
    <>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as='textarea'
          { ...register('content') }
        ></Form.Control>
        <p className='text-danger'>
          {errors?.content?.message}
        </p>
      </Form.Group>
    </>
  );
}