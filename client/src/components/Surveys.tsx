import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { ISurvey } from '../entities/survey.model';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchSurveys } from '../store/surveys/slice';
import { getSurveysByDateDesc } from '../store/surveys/selectors';
import { RequestInfo } from './RequestInfo';
import { SurveyListItem } from './SurveyListItem';

export interface ISurveysProps extends RouteComponentProps {
}

export const Surveys: FC<ISurveysProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const surveys = useAppSelector(getSurveysByDateDesc);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, [dispatch]);

  return (
    <div className='surveys'>
      <h2>Surveys</h2>
      <RequestInfo requestKey='fetch_surveys' />
      {surveys.map((survey: ISurvey) => {
        return (
          <SurveyListItem key={survey.uuid} surveyId={survey.uuid} />
        );
      })}

      {children}
    </div>
  );
};