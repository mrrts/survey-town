import React, { FC } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useAppSelector } from '../../store';
import { getUser } from '../../store/auth/selectors';
import { useModal } from '../../util/hooks/useModal.hook';
import { ModalKeys } from '../../constants/ModalKeys.enum';

export interface ISurveyListItemProps {
  surveyId: string;
}

export const SurveyListItem: FC<ISurveyListItemProps> = ({ surveyId }) => {
  const { survey, authorHandle, numberOfResponses } = useSurvey(surveyId);
  const user = useAppSelector(getUser);
  const surveyGeneralModal = useModal(ModalKeys.SURVEY_GENERAL);

  const isOwner = user && survey?.author === user.uuid;

  const handleEditTitleClick = () => {
    surveyGeneralModal.setData({ surveyId });
    surveyGeneralModal.openModal();
  };

  return (
    <div className='survey-list-item'>
      <Card className='survey-card'>
        <Card.Body>
          <Card.Title>
            {survey?.title}
            &nbsp; 
            <Badge className='responses-badge' bg='info' pill>
              {numberOfResponses} response{numberOfResponses === 1 ? '' : 's'}
            </Badge>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">by {authorHandle}</Card.Subtitle>
          
          <Card.Text>
            Description: {survey.description}
          </Card.Text>

          <div className='survey-card-actions'>
            <Button className='take-survey-button' variant='primary'>
              <span>Take this survey</span>
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </Button>
            {isOwner && (
              <>
                <Button className='edit-survey-general-button' variant='info' onClick={handleEditTitleClick}>
                  <span>Edit Title/Description</span>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
                <Button className='edit-survey-general-button' variant='info'>
                  <span>Edit Questions</span>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Button>
              </>
            )}
          </div>

        </Card.Body>
      </Card>
    </div>
  );
};