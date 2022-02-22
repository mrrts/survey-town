import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';
import { SurveyItemType } from '../../../constants/SurveyItemType.enum';

interface IItemResultsProps {
  surveyItemId: string;
}

export const ItemResults: FC<IItemResultsProps> = ({ surveyItemId }) => {
  const { surveyItem, surveyItemTypeData, itemType } = useSurveyItem(surveyItemId);

  const ResultsComponent = surveyItemTypeData?.resultsComponent;

  if (itemType === SurveyItemType.CONTENT_INTERLUDE) {
    return null;
  }

  return (
    <div className='card item-results my-3'>
      <div className='item-results-header'>
        <h4>
          <FontAwesomeIcon className='text-primary me-2' icon={surveyItemTypeData.icon} />
          {surveyItemTypeData.label}
        </h4>
        <p className='item-results-prompt' dangerouslySetInnerHTML={{ __html: surveyItem?.prompt as string }} />

        <h5>Responses</h5>
        
        <ResultsComponent surveyItemId={surveyItemId} />
      </div>
    </div>
  );
}