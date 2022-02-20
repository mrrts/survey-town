import React, { ComponentType, FC, useCallback, useEffect, useState } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch } from '../../../store';
import { destroySurveyItem, updateSurveyItem } from '../../../store/surveys/slice';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { RequestInfo } from '../../common/RequestInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export interface ISurveyItemFormProps {
  surveyId: string;
  surveyItemId: string;
}

export const SurveyItemForm: FC<ISurveyItemFormProps> = ({ surveyId, surveyItemId }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { surveyItem } = useSurveyItem(surveyItemId);
  const { itemType } = surveyItem || {};
  const itemTypeData = SurveyItemTypeData[itemType];
  const dispatch = useAppDispatch();

  const schema = itemTypeData?.schema;

  const form = useForm({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, getValues, formState: { isDirty }} = form;

  const onSubmit = useCallback((data: any) => {
    const values = getValues();
    const dto = { ...values, itemType };
    dispatch(updateSurveyItem({ surveyId, surveyItemId: surveyItem?.uuid, dto }));
  }, [getValues, dispatch, surveyId, surveyItem, itemType]);

  const handleDeleteItemClick = useCallback(() => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    dispatch(destroySurveyItem({ surveyId, surveyItemId: surveyItem?.uuid }))
  }, [dispatch, isConfirmingDelete, setIsConfirmingDelete, surveyId, surveyItem]);

  const FieldsComponent = (itemTypeData?.fieldsComponent || 'div') as ComponentType<{ surveyItemId: string }>;

  useEffect(() => {
    if (isConfirmingDelete) {
      const t = setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [isConfirmingDelete, setIsConfirmingDelete]);

  return (
    <Form className='survey-item-form' onSubmit={handleSubmit(onSubmit)}>
      <FormProvider { ...form }>
        <FieldsComponent
          surveyItemId={surveyItem?.uuid}
        />
      </FormProvider>
      <div className='survey-item-actions'>
        <Button className='me-2' variant='link' size='sm' onClick={handleDeleteItemClick}>
          <FontAwesomeIcon icon={faTrash} />
          {isConfirmingDelete ? 'Confirm?' : 'Delete Item'}
        </Button>
        <Button variant='success' type='submit' size='sm' disabled={!isDirty}>
          <FontAwesomeIcon icon={faCheckCircle} />
          Save
        </Button>
      </div>
      <RequestInfo requestKey={`update_survey_item_${surveyItemId}`} />
    </Form>
  );
}