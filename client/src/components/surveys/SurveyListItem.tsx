import React, { FC, useCallback, useState } from 'react';
import { useSurvey } from '../../util/hooks/useSurvey.hook';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../util/hooks/useModal.hook';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { Link } from '@reach/router';
import { formatDistance } from 'date-fns';
import { useAppDispatch } from '../../store';
import { destroySurvey } from '../../store/surveys/slice';

export interface ISurveyListItemProps {
  surveyId: string;
}

export const SurveyListItem: FC<ISurveyListItemProps> = ({ surveyId }) => {
  const { survey, authorHandle, numberOfResponses, isOwner } = useSurvey(surveyId);
  const takeSurveyModal = useModal(ModalKeys.TAKE_SURVEY);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const dispatch = useAppDispatch();

  const handleTakeSurveyClick = useCallback(() => {
    takeSurveyModal.setData({ surveyId });
    takeSurveyModal.openModal();
  }, [takeSurveyModal, surveyId]);

  const handleDeleteClick = useCallback(() => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 5000);
      return;;
    }
    dispatch(destroySurvey({ surveyId }))
  }, [isConfirmingDelete, setIsConfirmingDelete, dispatch, surveyId]);

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
            {isOwner && (
              <>
                <Link to={`/surveys/${surveyId}/edit`} className='btn btn-link btn-sm edit-survey-general-button'>
                  <FontAwesomeIcon icon={faPencilAlt} />
                  <span>Edit Survey</span>
                </Link>
                <Button variant='link' size='sm' onClick={handleDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                  {isConfirmingDelete ?  'Confirm?' : 'Delete'}
                </Button>
              </>
            )}
          </div>
          <Button className='take-survey-button' variant='primary' onClick={handleTakeSurveyClick}>
            <span>Take this survey</span>
            <FontAwesomeIcon icon={faArrowCircleRight} />
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};