import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/Form';
import { Controller, useFormContext } from 'react-hook-form';
import { RichTextEditor } from '../../common/RichTextEditor';

interface ITakeFreeResponseProps {
  surveyItemId: string;
}

export const TakeFreeResponse: FC<ITakeFreeResponseProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { control, formState: { errors }} = useFormContext();
  
  if (!surveyItem) {
    return <Spinner />;
  }

  return (
    <div className='take-free-response-container animate__animated animate__fadeIn'>
      <p dangerouslySetInnerHTML={{ __html: surveyItem?.prompt as string }} />

      <Form.Group>
        <Controller
          name='freeResponse'
          control={control}
          render={({ field }) => (
            <RichTextEditor
              { ...field }
              placeholder='Type your response here'
            />
          )}
        />
        <p className='text-danger'>{errors.freeResponse?.message}</p>
      </Form.Group>
    </div>
  );
}