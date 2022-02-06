import { Link, RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';
import { ISurvey } from '../entities/survey.model';
import { useSurvey } from '../util/hooks/useSurvey.hook';

export interface ISurveyProps {
  surveyId: string;
}

export const Survey: FC<ISurveyProps> = ({ surveyId }) => {
  const { survey } = useSurvey(surveyId);

  return (
    <div className='survey'>
      <Link to={`/surveys/${surveyId}`}>
        Survey {survey?.uuid}
      </Link>
    </div>
  );
};