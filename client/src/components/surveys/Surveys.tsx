import { RouteComponentProps } from '@reach/router';
import React, { FC, useEffect } from 'react';
import { ISurvey } from '../../entities/survey.model';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchSurveys } from '../../store/surveys/slice';
import { getSurveysByDateDesc } from '../../store/surveys/selectors';
import { RequestInfo } from '../common/RequestInfo';
import { SurveyListItem } from './SurveyListItem';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { useModal } from '../../util/hooks/useModal.hook';
import { CreateSurveyModal } from './CreateSurveyModal';

export interface ISurveysProps extends RouteComponentProps {
}

export const Surveys: FC<ISurveysProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const createSurveyModal = useModal(ModalKeys.CREATE_SURVEY);
  const surveys = useAppSelector(getSurveysByDateDesc);

  useEffect(() => {
    dispatch(fetchSurveys());
  }, [dispatch]);

  return (
    <div className='surveys'>
      <div className='surveys-header'>
        <h2>Surveys</h2>
        <div className='actions'>
          <Button 
            className='btn-lg create-survey-button'
            variant='primary'
            onClick={() => createSurveyModal.openModal()}
          >
            <FontAwesomeIcon icon={faPlusCircle} className='create-survey-button-icon' />
            <span>Create a Survey</span>
          </Button>
        </div>
      </div>
      <RequestInfo requestKey='fetch_surveys' />
      {surveys.map((survey: ISurvey) => {
        return (
          <SurveyListItem key={survey.uuid} surveyId={survey.uuid} />
        );
      })}

      {children}

      <CreateSurveyModal />
    </div>
  );
};