import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { ISurveyItem } from '../../../entities/survey-item.model';
import { useSurvey } from '../../../util/hooks/useSurvey.hook';
import { SurveyItemForm } from './SurveyItemForm';
import FlipMove from 'react-flip-move';

export interface IItemsListProps {
  surveyId: string;
}

export const ItemsList: FC<IItemsListProps> = ({ surveyId }) => {
  const { surveyItems } = useSurvey(surveyId);

  return (
    <ul className='survey-items-list'>
      <FlipMove typeName={null}>
        {surveyItems.map((surveyItem: ISurveyItem) => {
          if (!surveyItem?.uuid) { return null; }
          const itemTypeData = SurveyItemTypeData[surveyItem.itemType];
          return (
            <li key={surveyItem.uuid} className='survey-items-list-item card'>
              <h3 className='survey-item-header'>
                <FontAwesomeIcon className='survey-item-icon' icon={itemTypeData.icon} />
                {itemTypeData.label}
              </h3>
              <p className='survey-item-description text-muted'>{itemTypeData.description}</p>
              {surveyItem && (
                <SurveyItemForm surveyId={surveyId} surveyItemId={surveyItem.uuid} />
              )}
            </li>
          );
        })}
      </FlipMove>
    </ul>
  );
}