import React, { FC } from 'react';
import { useTakeSurvey } from '../../../util/hooks/useTakeSurvey.hook';
import Card from 'react-bootstrap/Card';

interface ICurrentItemProps {
  surveyId: string;
}

export const CurrentItem: FC<ICurrentItemProps> = ({ surveyId }) => {
  const { currentItemId, currentItemIndex } = useTakeSurvey(surveyId);

  return (
    <Card className='take-current-item-card'>
      {currentItemIndex}: {currentItemId}
    </Card>
  );
}