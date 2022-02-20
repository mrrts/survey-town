import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';

interface ITakeContentInterludeProps {
  surveyItemId: string;
}

export const TakeContentInterlude: FC<ITakeContentInterludeProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  return (
    <div className='take-content-interlude-container animate__animated animate__fadeInRight'>
      <div className='content-interlude-content'>
        {surveyItem.content}
      </div>
    </div>
  );
}