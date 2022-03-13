import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { RichTextEditor } from '../../common/RichTextEditor';

interface IContentInterludeFieldsProps {
  surveyItemId: string;
}

export const ContentInterludeFields: FC<IContentInterludeFieldsProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { formState: { errors }, control} = useFormContext();

  return (
    <div className='content-interlude-fields'>
      <Form.Group controlId='content'>
        <Form.Label>Content</Form.Label>
        <Controller
          name='content'
          control={control}
          defaultValue={surveyItem?.content}
          render={({ field }) => (
            <RichTextEditor
              { ...field }
              defaultValue={surveyItem?.content}
            />
          )}
        />
        <p className='text-danger'>
          {errors?.content?.message}
        </p>
      </Form.Group>
    </div>
  );
}