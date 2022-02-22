import React, { FC } from 'react';
import { ISurveyResponse } from '../../../entities/survey-response.model';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';

interface IFreeResponseResults {
  surveyItemId: string;
}

export const FreeResponseResults: FC<IFreeResponseResults> = ({ surveyItemId }) => {
  const { surveyItem, surveyItemTypeData, responses } = useSurveyItem(surveyItemId);

  return (
    <div className='free-response-results'>
      <ul>
        {responses.map((response: ISurveyResponse) => (
          <li key={response.uuid} dangerouslySetInnerHTML={{ __html: response.freeResponse as string }} />
        ))}
      </ul>
    </div>
  );
}