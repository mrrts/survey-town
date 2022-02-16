import React, { createElement, FC, useCallback } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch } from '../../../store';
import { updateSurveyItem } from '../../../store/surveys/slice';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { RequestInfo } from '../../common/RequestInfo';

export interface ISurveyItemFormProps {
  surveyId: string;
  surveyItemId: string;
}

export const SurveyItemForm: FC<ISurveyItemFormProps> = ({ surveyId, surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { itemType } = surveyItem;
  const itemTypeData = SurveyItemTypeData[itemType];
  const dispatch = useAppDispatch();

  const schema = itemTypeData.schema;

  const { register, handleSubmit, getValues, formState: { errors, isDirty }, reset, control } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback((data: any) => {
    const values = getValues();
    const dto = { ...values, itemType };
    dispatch(updateSurveyItem({ surveyId, surveyItemId: surveyItem.uuid, dto }));
  }, [getValues, dispatch, surveyId, surveyItem, itemType]);

  return (
    <Form className='survey-item-form' onSubmit={handleSubmit(onSubmit)}>
      {
        createElement(
          itemTypeData.fieldsComponent,
          { register, errors, control, surveyItemId: surveyItem.uuid, reset } as any
        )
      }
      <div className='survey-item-actions'>
        <Button className='me-1' variant='secondary' onClick={() => reset()} disabled={!isDirty}>
          Reset
        </Button>
        <Button variant='success' type='submit' disabled={!isDirty}>
          Save
        </Button>
      </div>
      <RequestInfo requestKey={`update_survey_item_${surveyItemId}`} />
    </Form>
  );
}