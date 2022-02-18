import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/Form';
import { useFormContext } from 'react-hook-form';

interface ITakeFreeResponseProps {
  surveyItemId: string;
}

export const TakeFreeResponse: FC<ITakeFreeResponseProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { register, formState: { errors }} = useFormContext();
  
  if (!surveyItem) {
    return <Spinner />;
  }

  return (
    <div className='take-free-response-container'>
      <p>{surveyItem.prompt}</p>

      <Form.Group>
        <Form.Control
          { ...register('freeResponse') }
          as='textarea'
          rows={3}
          placeholder='Type your response here'
        />
        <p className='text-danger'>{errors.freeResponse?.message}</p>
      </Form.Group>
    </div>
  );
}