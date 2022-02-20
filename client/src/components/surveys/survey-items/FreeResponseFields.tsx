import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from "../../../util/hooks/useSurveyItem.hook";
import { RichTextEditor } from '../../common/RichTextEditor';

interface IFreeResponseFieldsProps {
  surveyItemId: string;
}

export const FreeResponseFields: FC<IFreeResponseFieldsProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { formState: { errors }, control} = useFormContext();

  return (
    <>
      <Form.Group>
        <Form.Label>Question / Prompt</Form.Label>
        <Controller
          name='prompt'
          control={control}
          render={({ field }) => (
            <RichTextEditor
              { ...field }
              defaultValue={surveyItem?.prompt}
            />
          )}
        />
        <p className='text-danger'>{errors?.prompt?.message}</p>
      </Form.Group>
    </>
  );
}