import React, { FC, useMemo } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { reduce, filter, keys, flatMap } from 'lodash';
import { ISurveyResponse } from '../../../entities/survey-response.model';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface IMultipleSelectResults {
  surveyItemId: string;
}

export const MultipleSelectResults: FC<IMultipleSelectResults> = ({ surveyItemId }) => {
  const { surveyItem, responses } = useSurveyItem(surveyItemId);

  const responseSelections = flatMap(responses, (resp: ISurveyResponse) => resp.selections);
  
  const totalResponses = responses.length;
  
  const choicePercentages = useMemo(() => {
    const choices = surveyItem?.choices || [];
    return reduce(
      choices,
      (acc: Record<string, number>, choice: string) => {
        const numberSelections = filter(responseSelections, (selection: string) => selection === choice).length;
        const percentage = totalResponses === 0 ? 0 : Math.floor(numberSelections / totalResponses * 100);
        return {
          ...acc,
          [choice]: percentage
        };
      },
      {}
    );
  }, [surveyItem?.choices, responseSelections, totalResponses]);

  return (
    <div className='multiple-select-results'>
      {keys(choicePercentages).map((choice: string, i: number) => (
        <div key={`${i}-${choice}`} className='my-2 choice-container'>
          <span className='choice-text'>{choice}</span>
          <ProgressBar now={choicePercentages[choice]} label={`${choicePercentages[choice]}%`} />
        </div>
      ))}
    </div>
  );
}