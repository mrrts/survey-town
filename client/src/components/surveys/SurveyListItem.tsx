import React, { FC, useCallback } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../util/hooks/useModal.hook';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { Link } from '@reach/router';
import { formatDistance } from 'date-fns';

export interface ISurveyListItemProps {
  surveyId: string;
}

export const SurveyListItem: FC<ISurveyListItemProps> = ({ surveyId }) => {
  const { survey, authorHandle, numberOfResponses, isOwner } = useSurvey(surveyId);
  const takeSurveyModal = useModal(ModalKeys.TAKE_SURVEY);

  const handleTakeSurveyClick = useCallback(() => {
    takeSurveyModal.setData({ surveyId });
    takeSurveyModal.openModal();
  }, [takeSurveyModal, surveyId]);

  const createdAgoPhrase = formatDistance(survey?.createdAt, new Date(), { addSuffix: true });

  return (
    <div className='survey-list-item'>
      <Card className='survey-card'>
        <Card.Body>
          <Card.Title className='survey-list-item-title'>
            {survey?.title}
            &nbsp; 
            <Badge className='responses-badge' bg='info' pill>
              {numberOfResponses} response{numberOfResponses === 1 ? '' : 's'}
            </Badge>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            by {authorHandle}, {createdAgoPhrase}
          </Card.Subtitle>
          
          <Card.Text aria-label='description of survey'>
            {survey.description}
          </Card.Text>

          <div className='survey-card-actions'>
            <Button className='take-survey-button' variant='primary' onClick={handleTakeSurveyClick}>
              <span>Take this survey</span>
              <FontAwesomeIcon icon={faArrowCircleRight} />
            </Button>
            {isOwner && (
              <Link to={`/surveys/${surveyId}/edit`} className='btn btn-info edit-survey-general-button'>
                <span>Edit Survey</span>
                <FontAwesomeIcon icon={faPencilAlt} />
              </Link>
            )}
          </div>

        </Card.Body>
      </Card>
    </div>
  );
};