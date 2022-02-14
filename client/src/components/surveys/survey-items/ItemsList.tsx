import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC } from 'react';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { ISurveyItem } from '../../../entities/survey-item.model';
import { useSurvey } from '../../../util/hooks/useSurvey.hook';
import { SurveyItemForm } from './SurveyItemForm';

export interface IItemsListProps {
  surveyId: string;
}

export const ItemsList: FC<IItemsListProps> = ({ surveyId }) => {
  const { surveyItems } = useSurvey(surveyId);

  return (
    <ul className='survey-items-list'>
      {surveyItems.map((surveyItem: ISurveyItem) => {
        const itemTypeData = SurveyItemTypeData[surveyItem.itemType];
        return (
          <li key={surveyItem.uuid} className='survey-items-list-item'>
            <h3>
              <FontAwesomeIcon icon={itemTypeData.icon} />
              {itemTypeData.label}
            </h3>
            <p>{itemTypeData.description}</p>
            <SurveyItemForm surveyId={surveyId} surveyItem={surveyItem} />
          </li>
        );
      })}
    </ul>
  );
}