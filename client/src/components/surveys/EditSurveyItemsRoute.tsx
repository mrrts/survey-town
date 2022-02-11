import { RouteComponentProps } from '@reach/router';
import React, { FC } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';

export interface IEditSurveyItemsRouteProps extends RouteComponentProps {
  surveyId?: string;
}

export const EditSurveyItemsRoute: FC<IEditSurveyItemsRouteProps> = ({ surveyId }) => {
  const { survey } = useSurvey(surveyId as string);

  return (
    <div className='edit-survey-items-route'>
      <h2>Edit Survey Items</h2>
      <h3>{survey?.title}</h3>
      <p>{survey?.description}</p>

      <p>EDIT-SURVEY-ITEMS UI</p>
    </div>
  );
}