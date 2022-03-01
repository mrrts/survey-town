import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/Form';
import { trim } from 'lodash';
import { useFormContext } from 'react-hook-form';

interface ITakeMultipleSelectProps {
  surveyItemId: string;
}

export const TakeMultipleSelect: FC<ITakeMultipleSelectProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { register, formState: { errors }} = useFormContext();

  if (!surveyItem) {
    return <Spinner />;
  }

  return (
    <div className='take-multiple-select-container animate__animated animate__fadeIn'>
      <div className='prompt' dangerouslySetInnerHTML={{ __html: surveyItem?.prompt as string }} />

      <Form.Group controlId='selections'>
        <Form.Label className='sr-only'>Make your selections</Form.Label>
        {surveyItem.choices?.map((choice: string, i: number) => {
          return (
            <Form.Check
              { ...register('selections') }
              key={`${i}-${choice}`}
              type='checkbox'
              value={choice}
              label={trim(choice)}
            />
          );
        })}
      </Form.Group>
      <p className='text-danger'>{errors.selections?.message}</p>
    </div>
  );
}