import React, { FC, useCallback, useEffect, useState } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAppDispatch } from '../../../store';
import { destroySurveyItem, updateSurveyItem } from '../../../store/surveys/slice';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { RequestInfo } from '../../common/RequestInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheckCircle, faUndo } from '@fortawesome/free-solid-svg-icons';

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

  const { register, handleSubmit, getValues, formState: { errors, isDirty }, reset, control } = useForm({
    resolver: yupResolver(schema),
  });

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

  const FieldsComponent = itemTypeData?.fieldsComponent || 'div';

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
      <FieldsComponent
        register={register}
        errors={errors}
        control={control}
        surveyItemId={surveyItem?.uuid}
        reset={reset}
      />
      <div className='survey-item-actions'>
        <Button className='me-2' variant='link' size='sm' onClick={handleDeleteItemClick}>
          <FontAwesomeIcon icon={faTrash} />
          {isConfirmingDelete ? 'Confirm?' : 'Delete Item'}
        </Button>
        <Button className='me-2' variant='secondary' size='sm' onClick={() => reset()} disabled={!isDirty}>
          <FontAwesomeIcon icon={faUndo} />
          Revert to Saved
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