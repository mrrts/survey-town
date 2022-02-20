import { Redirect, RouteComponentProps } from '@reach/router';
import React, { FC, useCallback } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import { keys } from 'lodash';
import { SurveyItemTypeData } from '../../constants/SurveyItemTypeData';
import { SurveyItemType } from '../../constants/SurveyItemType.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPencilAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import { useModal } from '../../util/hooks/useModal.hook';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { ICreateSurveyItemDto } from '../../entities/dtos/create-survey-item.dto';
import { useAppDispatch } from '../../store';
import { createSurveyItem } from '../../store/surveys/slice';
import { ItemsList } from './survey-items/ItemsList';
import { Link } from '@reach/router';

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
  const { survey, isOwner } = useSurvey(surveyId as string);
  const surveyGeneralModal = useModal(ModalKeys.SURVEY_GENERAL);
  const dispatch = useAppDispatch();

  const handleOptionClick = useCallback((itemType: SurveyItemType) => {
    if (!surveyId) { return; }
    const dto: ICreateSurveyItemDto = {
      itemType,
      content: 'Default content',
      choices: ['Choice 1', 'Choice 2'],
      prompt: 'Default question?'
    };
    dispatch(createSurveyItem({ surveyId, dto }));
  }, [surveyId, dispatch]);

  const handleEditTitleClick = () => {
    surveyGeneralModal.setData({ surveyId: survey?.uuid });
    surveyGeneralModal.openModal();
  }

  if (!isOwner) {
    return <Redirect to='/surveys' noThrow />;
  }

  return (
    <div className='edit-survey-items-route animate__animated animate__fadeIn'>
      <p>
        <Link to='/surveys' className='btn btn-link btn-sm'>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to surveys list
        </Link>
      </p>
      <div className='edit-survey-items-header card'>
        <h2><span className='sr-only'>Edit survey</span> {survey?.title}</h2>
        <p><span className='sr-only'>Survey Description:</span> {survey?.description}</p>
        <p>
          <Button size='sm' variant='link' onClick={handleEditTitleClick}>
            <FontAwesomeIcon icon={faPencilAlt} />
            Edit title &amp; description
          </Button>
        </p>
      </div>

      <ItemsList surveyId={surveyId as string} />

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