import React, { FC } from 'react';
import { useSurvey } from '../util/hooks/useSurvey.hook';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

export interface ISurveyListItemProps {
  surveyId: string;
}

export const SurveyListItem: FC<ISurveyListItemProps> = ({ surveyId }) => {
  const { survey, authorHandle, numberOfResponses } = useSurvey(surveyId);

  return (
    <div className='survey-list-item'>
      <Card className='survey-card'>
        <Card.Body>
          <Card.Title>
            {survey?.title}
            &nbsp; <Badge className='responses-badge' bg='info' pill>{numberOfResponses} responses</Badge>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{authorHandle}</Card.Subtitle>
          
          <Card.Text>
            {survey.description}
          </Card.Text>
          <Button variant='primary'>
            Take this survey &nbsp;
            <FontAwesomeIcon icon={faArrowCircleRight} />
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};