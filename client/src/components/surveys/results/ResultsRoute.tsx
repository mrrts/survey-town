import { RouteComponentProps, Link } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { useSurvey } from '../../../util/hooks/useSurvey.hook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRequest } from '../../../util/hooks/useRequest.hook';
import { Spinner } from '../../common/Spinner';
import { useAppDispatch } from '../../../store';
import { fetchResponsesForSurvey } from '../../../store/surveys/slice';

interface IResultsRouteProps extends RouteComponentProps {
  surveyId?: string;
}

export const ResultsRoute: FC<IResultsRouteProps> = ({ surveyId }) => {
  const { survey } = useSurvey(surveyId as string);
  const { isPending } = useRequest(`fetch_responses_for_survey_${surveyId}`);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchResponsesForSurvey({ surveyId: surveyId as string }));
  }, [surveyId, dispatch]);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className='results-container animate__animated animate__fadeIn'>
      <Link to='/surveys' className='btn btn-link btn-sm my-2'>
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to surveys list
      </Link>

      <h2>Results for "{survey.title}"</h2>
    </div>
  );
};