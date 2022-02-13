import { RouteComponentProps } from '@reach/router';
import React, { FC, useCallback } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import { keys } from 'lodash';
import { SurveyItemTypeData } from '../../constants/SurveyItems';
import { SurveyItemType } from '../../constants/SurveyItemType.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export interface IEditSurveyItemsRouteProps extends RouteComponentProps {
  surveyId?: string;
}

const options = keys(SurveyItemTypeData).map((itemType: SurveyItemType) => {
  return {
    label: SurveyItemTypeData[itemType].label,
    value: itemType,
    description: SurveyItemTypeData[itemType].description,
    icon: SurveyItemTypeData[itemType].icon
  }
});

export const EditSurveyItemsRoute: FC<IEditSurveyItemsRouteProps> = ({ surveyId }) => {
  const { survey } = useSurvey(surveyId as string);

  const handleOptionClick = useCallback((itemType: SurveyItemType) => {
    console.log({ itemType });
  }, []);

  return (
    <div className='edit-survey-items-route'>
      <h2>{survey?.title}</h2>
      <p>{survey?.description}</p>

      <div className='add-item-container'>
        <DropdownButton title={(
          <>
            <FontAwesomeIcon icon={faPlusCircle} />
            Add item to survey &nbsp;
          </>
        )}>
          {options.map((option: any) => (
            <Dropdown.Item as='button' key={option.value} onClick={() => handleOptionClick(option.value)}>
              <div className='option-label fs-5'>
                <FontAwesomeIcon icon={option.icon} className='option-icon me-3 text-primary' />
                <span className='option-label-text'>{option.label}</span>
              </div>
              <div className='option-description fs-6 text-muted'>
                {option.description}
              </div>
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
    </div>
  );
}