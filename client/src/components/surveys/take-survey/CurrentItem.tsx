import React, { FC, useEffect, useState } from 'react';
import { useTakeSurvey } from '../../../util/hooks/useTakeSurvey.hook';
import Card from 'react-bootstrap/Card';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RequestInfo } from '../../common/RequestInfo';
import { useRequest } from '../../../util/hooks/useRequest.hook';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface ICurrentItemProps {
  surveyId: string;
}

export const CurrentItem: FC<ICurrentItemProps> = ({ surveyId }) => {
  const {
    currentItemId,
    setItemResponseData,
    prevItem,
    nextItem,
    goToFirstItem,
    goToNextItem,
    goToPrevItem,
    currentItemType,
    currentItemSubmittedValues,
    submitResponses,
    ownResponses,
    deleteOwnResponses,
    progressPercentage
  } = useTakeSurvey(surveyId);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState<string|null>(null);
  const { surveyItem } = useSurveyItem(currentItemId as string);
  const itemTypeData = SurveyItemTypeData[currentItemType];
  const TakeSurveyItemComponent = itemTypeData?.takeSurveyComponent;

  const takeSurveyDefaultValues = itemTypeData?.takeDefaultValues;
  const alreadyRespondedValue = currentItemSubmittedValues;
  
  // form changes for each survey item
  const defaultValues = alreadyRespondedValue || takeSurveyDefaultValues;
  const form = useForm({
    defaultValues
  });
  const { reset, formState: { isDirty }} = form;

  const submitRequestKey = `create_response_item_${currentItemId}`;
  const submitRequest = useRequest(submitRequestKey);

  const values = form.watch();

  const itemTakeSchema = itemTypeData?.takeSchema;

  const buttonShouldDisable = !isValid || !!submitRequest?.isPending

  const onItemSubmit = (data: any) => {
    setItemResponseData(currentItemId as string, {
      ...data,
      responseType: itemTypeData.responseType
    });
    goToNextItem();
  };

  const handlePrevClick = () => {
    setItemResponseData(currentItemId as string, {
      ...values,
      responseType: itemTypeData.responseType
    });
    goToPrevItem();
  }

  const handleSurveySubmitClick = async (e: React.MouseEvent) => {
    setItemResponseData(currentItemId as string, {
      ...values,
      responseType: itemTypeData.responseType
    });
    e.preventDefault();
    setShouldSubmit(true);
  }

  const handleDeleteResponsesClick = () => {
    deleteOwnResponses();
    goToFirstItem();
  };

  useEffect(() => {
    if (shouldSubmit) {
      submitResponses();
    }
  }, [shouldSubmit, submitResponses]);

  useEffect(() => {
    reset();
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!itemTakeSchema) { return; }
    itemTakeSchema.validate(values)
      .then((values: any) => {
        setIsValid(true);
        setValidationError(null);
      })
      .catch((err: yup.ValidationError) => {
        setIsValid(false);
        setValidationError(err.message);
      });
  }, [values, itemTakeSchema, setIsValid, setValidationError]);

  if (!TakeSurveyItemComponent && !ownResponses.length) {
    return <Spinner />;
  }

  if (ownResponses.length) {
    return (
      <div className='survey-already-taken-container'>
        Thank you for taking this survey!
        <div className='survey-already-taken-actions'>
          <Button variant='link' onClick={handleDeleteResponsesClick}>
            <FontAwesomeIcon icon={faUndo} />
            Undo &amp; Retake
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className='current-item-container'>
      <Card className='take-current-item-card'>
        <FormProvider { ...form }>
          <Form onSubmit={form.handleSubmit(onItemSubmit)}>
            <TakeSurveyItemComponent
              key={surveyItem?.uuid}
              surveyItemId={surveyItem?.uuid}
            />
            {isDirty && (<p className='text-danger'>{validationError}</p>)}
            <div className='take-survey-item-actions'>
              {!!prevItem && (
                <Button onClick={handlePrevClick}>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Previous
                </Button>
              )}
              {!!nextItem && (
                <Button type='submit' variant='primary' disabled={buttonShouldDisable}>
                  Save and continue
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              )}
              {!nextItem && (
                <Button
                  variant='success'
                  disabled={buttonShouldDisable}
                  onClick={handleSurveySubmitClick}
                >
                  Submit &amp; View Results
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              )}
            </div>
          </Form>
        </FormProvider>
        <RequestInfo requestKey={submitRequestKey} />
      </Card>
      <ProgressBar now={progressPercentage} />
    </div>
  );
}