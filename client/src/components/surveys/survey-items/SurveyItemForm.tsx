import React, { createElement, FC, useCallback } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { ISurveyItem } from '../../../entities/survey-item.model';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export interface ISurveyItemFormProps {
  surveyId: string;
  surveyItem: ISurveyItem;
}

export const SurveyItemForm: FC<ISurveyItemFormProps> = ({ surveyId, surveyItem }) => {
  const { itemType } = surveyItem;
  const itemTypeData = SurveyItemTypeData[itemType];

  const schema = itemTypeData.schema;

  const { register, handleSubmit, getValues, formState: { errors }, reset} = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback((data: any) => {
    const values = getValues();
    console.log({ values })
  }, [getValues]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {
        createElement(
          itemTypeData.fieldsComponent,
          { register, errors } as any
        )
      }
      <Button className='me-1' variant='secondary' onClick={() => reset()}>
        Reset
      </Button>
      <Button variant='success' type='submit'>
        Save
      </Button>
    </Form>
  );
}