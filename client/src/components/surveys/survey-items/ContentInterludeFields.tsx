import React, { FC } from 'react';
import { UseFormRegister } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';

interface IContentInterludeFieldsProps {
  register: UseFormRegister<any>;
  errors: { [x: string]: any };
  surveyItemId: string;
}

export const ContentInterludeFields: FC<IContentInterludeFieldsProps> = ({ register, errors, surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  return (
    <>
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as='textarea'
          { ...register('content') }
          defaultValue={surveyItem?.content}
        ></Form.Control>
        <p className='text-danger'>
          {errors?.content?.message}
        </p>
      </Form.Group>
    </>
  );
}