import React, { FC, useMemo } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { reduce, filter, keys } from 'lodash';
import { ISurveyResponse } from '../../../entities/survey-response.model';
import ProgressBar from 'react-bootstrap/ProgressBar';

interface IMultipleChoiceResults {
  surveyItemId: string;
}

export const MultipleChoiceResults: FC<IMultipleChoiceResults> = ({ surveyItemId }) => {
  const { surveyItem, responses } = useSurveyItem(surveyItemId);

  const responseSelections = responses.map((resp: ISurveyResponse) => resp.selection);
  
  const totalResponses = responses.length;
  
  const choicePercentages = useMemo(() => {
    const choices = surveyItem?.choices || [];
    return reduce(
      choices,
      (acc: Record<string, number>, choice: string) => {
        const numberSelections = filter(responseSelections, (selection: string) => selection === choice).length;
        const percentage = totalResponses === 0 ? 0 : Math.floor(numberSelections / totalResponses * 100)
        return {
          ...acc,
          [choice]: percentage
        };
      },
      {}
    );
  }, [surveyItem?.choices, responseSelections, totalResponses]);

  return (
    <div className='multiple-choice-results'>
      {keys(choicePercentages).map((choice: string) => (
        <>
          <p>
            {choice}
            <ProgressBar now={choicePercentages[choice]} label={`${choicePercentages[choice]}%`} />
          </p>
        </>
      ))}
    </div>
  );
}