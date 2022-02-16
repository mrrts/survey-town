import React, { FC, useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../../store';
import { fetchOwnResponsesForSurvey, setCurrentTakingSurveyItem } from '../../../store/surveys/slice';
import { useRequest } from '../../../util/hooks/useRequest.hook';
import { useTakeSurvey } from '../../../util/hooks/useTakeSurvey.hook';
import { RequestInfo } from '../../common/RequestInfo';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import { CurrentItem } from './CurrentItem';
import Button from 'react-bootstrap/Button';

interface ITakeSurveyProps {
  surveyId: string;
}

export const TakeSurvey: FC<ITakeSurveyProps> = ({ surveyId }) => {
  const dispatch = useAppDispatch();

  const fetchOwnResponsesRequestKey = `fetch_own_responses_for_survey_${surveyId}`;
  const fetchingOwnResponses = useRequest(fetchOwnResponsesRequestKey).isPending;

  const {
    firstItemWithoutResponse,
    currentItemId,
    hasNextItem,
    goToNextItem
  } = useTakeSurvey(surveyId);

  const handleNextClick = useCallback(() => {
    goToNextItem();
  }, [goToNextItem]);

  useEffect(() => {
    dispatch(fetchOwnResponsesForSurvey({ surveyId }));
  }, [dispatch, surveyId]);

  // go to the first item that the user hasn't responded to yet
  useEffect(() => {
    dispatch(setCurrentTakingSurveyItem({ surveyItemId: firstItemWithoutResponse?.uuid }));
  }, [dispatch, firstItemWithoutResponse])

  if (fetchingOwnResponses) {
    return <RequestInfo requestKey={fetchOwnResponsesRequestKey} />;
  }

  return (
    <div className='take-survey-container'>
      <ReactCSSTransitionReplace
        transitionName='surveyItemSwitch'
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={500}
      >
        <CurrentItem
          key={currentItemId}
          surveyId={surveyId}
        />
      </ReactCSSTransitionReplace>
      <div className='take-survey-actions'>
        {hasNextItem && (
          <Button
            size='sm'
            variant='primary'
            onClick={handleNextClick}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}