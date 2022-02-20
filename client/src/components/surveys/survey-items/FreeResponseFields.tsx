import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from "../../../util/hooks/useSurveyItem.hook";

interface IFreeResponseFieldsProps {
  surveyItemId: string;
}

export const FreeResponseFields: FC<IFreeResponseFieldsProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { register, formState: { errors }} = useFormContext();

  return (
    <>
      <Form.Group>
        <Form.Label>Question / Prompt</Form.Label>
        <Form.Control
          as='textarea'
          rows={2}
          { ...register('prompt') }
          defaultValue={surveyItem?.prompt}
        />
        <p className='text-danger'>{errors?.prompt?.message}</p>
      </Form.Group>
    </>
  );
}