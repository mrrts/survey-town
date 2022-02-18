import React, { FC, useEffect, useState } from 'react';
import { useTakeSurvey } from '../../../util/hooks/useTakeSurvey.hook';
import Card from 'react-bootstrap/Card';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { Spinner } from '../../common/Spinner';
import Form from 'react-bootstrap/form';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { RequestInfo } from '../../common/RequestInfo';
import { useRequest } from '../../../util/hooks/useRequest.hook';

interface ICurrentItemProps {
  surveyId: string;
}

export const CurrentItem: FC<ICurrentItemProps> = ({ surveyId }) => {
  const {
    currentItemId,
    setItemResponseData,
    prevItem,
    nextItem,
    goToNextItem,
    goToPrevItem,
    currentItemType,
    currentItemSubmittedValues,
    submitResponses,
    ownResponses
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

  useEffect(() => {
    if (shouldSubmit) {
      console.log('submitting');
      submitResponses();
    }
  }, [shouldSubmit]);

  useEffect(() => {
    form.reset();
  }, [defaultValues, form.reset]);

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

  useEffect(() => {
    console.log({ isValid, values, validationError, takeSurveyDefaultValues })
  }, [isValid, values, validationError, takeSurveyDefaultValues]);

  if (!TakeSurveyItemComponent && !ownResponses.length) {
    return <Spinner />;
  }

  if (ownResponses.length) {
    return (
      <div className='survey-already-taken-container'>
        Thank you for taking this survey!
        <Button onClick={() => alert('clear responses')}>
          Delete my responses
        </Button>
      </div>
    );
  }
  
  return (
    <div className='current-item-container'>
      <ReactCSSTransitionReplace
        transitionName='surveyItemSwitch'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={500}
      >
        <Card key={currentItemId} className='take-current-item-card'>
          <FormProvider { ...form }>
            <Form onSubmit={form.handleSubmit(onItemSubmit)}>
              <TakeSurveyItemComponent
                surveyItemId={surveyItem?.uuid}
              />
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
                  </Button>
                )}
              </div>
            </Form>
          </FormProvider>
          <RequestInfo requestKey={submitRequestKey} />
        </Card>
      </ReactCSSTransitionReplace>
    </div>
  );
}