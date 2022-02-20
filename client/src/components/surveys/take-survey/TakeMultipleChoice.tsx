import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/Form';
import { trim } from 'lodash';
import { useFormContext } from 'react-hook-form';

interface ITakeMultipleChoiceProps {
  surveyItemId: string;
}

export const TakeMultipleChoice: FC<ITakeMultipleChoiceProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { register, formState: { errors }} = useFormContext();

  if (!surveyItem) {
    return <Spinner />;
  }

  return (
    <div className='take-multiple-choice-container animate__animated animate__fadeInRight'>
      <p>{trim(surveyItem.prompt)}</p>

      {surveyItem.choices?.map((choice: string, i: number) => {
        return (
          <Form.Check
            { ...register('selection') }
            key={`${i}-${choice}`}
            type='radio'
            value={choice}
            label={trim(choice)}
          />
        );
      })}
      <p className='text-danger'>{errors.selection?.message}</p>
    </div>
  );
}