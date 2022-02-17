import React, { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import { useSurveyItem } from "../../../util/hooks/useSurveyItem.hook";

interface IFreeResponseFieldsProps {
  register: UseFormRegister<any>;
  errors: { [x: string]: any };
  surveyItemId: string;
}

export const FreeResponseFields: FC<IFreeResponseFieldsProps> = ({ register, errors, surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);

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