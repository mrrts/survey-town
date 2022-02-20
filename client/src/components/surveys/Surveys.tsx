import { RouteComponentProps } from '@reach/router';
import React, { FC, useRef } from 'react';
import { ISurvey } from '../../entities/survey.model';
import { useAppSelector } from '../../store';
import { getSurveysByDateDesc } from '../../store/surveys/selectors';
import { RequestInfo } from '../common/RequestInfo';
import { SurveyListItem } from './SurveyListItem';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { useModal } from '../../util/hooks/useModal.hook';
import FlipMove from 'react-flip-move';

export interface ISurveysProps extends RouteComponentProps {
}

export const Surveys: FC<ISurveysProps> = ({ children }) => {
  const surveyFormModal = useModal(ModalKeys.SURVEY_GENERAL);
  const surveys = useAppSelector(getSurveysByDateDesc);

  const handleCreateClick = () => {
    surveyFormModal.clearData();
    surveyFormModal.openModal();
  }

  return (
    <div className='surveys'>
      <div className='surveys-header'>
        <h2>Surveys</h2>
        <div className='actions'>
          <Button 
            className='btn-lg create-survey-button'
            variant='primary'
            onClick={handleCreateClick}
          >
            <FontAwesomeIcon icon={faPlusCircle} className='create-survey-button-icon' />
            <span>Create a Survey</span>
          </Button>
        </div>
      </div>
      <RequestInfo requestKey='fetch_surveys' />
      <FlipMove typeName={null}>
        {surveys.map((survey: ISurvey) => {
          return (
            <SurveyListItem key={survey.uuid} surveyId={survey.uuid} />
          );
        })}
      </FlipMove>

      {children}
    </div>
  );
};