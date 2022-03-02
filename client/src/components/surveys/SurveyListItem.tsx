import React, { FC, forwardRef, useCallback, useEffect, useState } from 'react';
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

// forwardRef is required for FlipMove, which wraps the list items, to work properly
export const SurveyListItem: FC<ISurveyListItemProps> = forwardRef(({ surveyId }, ref: React.ForwardedRef<HTMLDivElement>) => {
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
      return;
    }
    dispatch(destroySurvey({ surveyId }))
  }, [isConfirmingDelete, setIsConfirmingDelete, dispatch, surveyId]);

  const createdAgoPhrase = survey
    ? formatDistance(survey.createdAt, new Date(), { addSuffix: true })
    : undefined;

  useEffect(() => {
    if (isConfirmingDelete) {
      const t = setTimeout(() => {
        setIsConfirmingDelete(false);
      }, 5000);
      return () => clearTimeout(t);
    } 
  }, [isConfirmingDelete, setIsConfirmingDelete]);

  return (
    <div className='survey-list-item' ref={ref}>
      <Card className='survey-card'>
        <Card.Body>
          <Card.Title as='div' className='survey-list-item-title'>
            <h3 className='sr-only'>Survey Title</h3>
            {survey?.title}
            &nbsp; 
            <Badge className='responses-badge' bg='info' pill>
              {numberOfResponses} response{numberOfResponses === 1 ? '' : 's'}
            </Badge>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted authored-by">
            by {authorHandle}, {createdAgoPhrase}
          </Card.Subtitle>
          
          <Card.Text as='div' className='description'>
            <h4 className='sr-only'>Description</h4>
            <div dangerouslySetInnerHTML={{ __html: survey?.description }} />
          </Card.Text>

          <div className='survey-card-actions'>
            {isOwner && (
              <div className='my-2'>
                <Link to={`/surveys/${surveyId}/edit`} className='btn btn-link btn-sm edit-survey-general-button'>
                  <FontAwesomeIcon icon={faPencilAlt} />
                  <span>Edit Survey</span>
                </Link>
                <Button className='delete-survey-button' variant='link' size='sm' onClick={handleDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                  {isConfirmingDelete ?  'Confirm?' : 'Delete'}
                </Button>
              </div>
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
});