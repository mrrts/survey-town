import React, { FC } from 'react';
import { useSurveyItem } from '../../../util/hooks/useSurveyItem.hook';

interface ITakeContentInterludeProps {
  surveyItemId: string;
}

export const TakeContentInterlude: FC<ITakeContentInterludeProps> = ({ surveyItemId }) => {
  const { surveyItem } = useSurveyItem(surveyItemId);
  return (
    <div className='take-content-interlude-container animate__animated animate__fadeIn'>
      <div 
        className='content-interlude-content'
        dangerouslySetInnerHTML={{ __html: surveyItem?.content as string }}
      />
    </div>
  );
}