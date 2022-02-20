import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';

interface IContentInterludeFieldsProps {
  surveyItemId: string;
}

export const ContentInterludeFields: FC<IContentInterludeFieldsProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { register, formState: { errors }} = useFormContext();

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