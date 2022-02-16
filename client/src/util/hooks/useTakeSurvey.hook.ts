import { useAppDispatch, useAppSelector } from "../../store";
import { getCurrentTakingSurveyItem, getOwnResponsesForSurvey } from "../../store/surveys/selectors";
import { useSurvey } from "./useSurvey.hook";
import { findIndex, find } from 'lodash';
import { ISurveyItem } from "../../entities/survey-item.model";
import { useCallback, useMemo } from "react";
import { setCurrentTakingSurveyItem } from "../../store/surveys/slice";
import { ISurveyResponse } from "../../entities/survey-response.model";

export const useTakeSurvey = (surveyId: string) => {
  const dispatch = useAppDispatch();
  const { surveyItems } = useSurvey(surveyId);
  const currentItemId = useAppSelector(getCurrentTakingSurveyItem);
  const ownResponsesSelector = useMemo(() => getOwnResponsesForSurvey(surveyId), [surveyId]);
  const ownResponses = useAppSelector(ownResponsesSelector);

  const numItems = surveyItems.length;

  const currentItemIndex = useMemo(() => findIndex(
    surveyItems,
    (item: ISurveyItem) => item.uuid === currentItemId
  ), [surveyItems, currentItemId]);

  const prevItemIndex = currentItemIndex - 1;
  const nextItemIndex = currentItemIndex + 1;

  // Be sure to check in component for defined prevItem and nextItem
  const currentItem = surveyItems[currentItemIndex];
  const prevItem = surveyItems[prevItemIndex];
  const nextItem = surveyItems[nextItemIndex];

  const firstItemWithoutResponse = useMemo(() => find(
    surveyItems,
    (item: ISurveyItem) => {
      const hasResponse = find(
        ownResponses,
        (resp: ISurveyResponse) => resp.surveyItem === item.uuid
      );
      return !hasResponse;
    }
  ), [surveyItems, ownResponses]);

  const goToNextItem = useCallback(() => {
    dispatch(setCurrentTakingSurveyItem({ surveyItemId: nextItem?.uuid }));
  }, [dispatch, nextItem]);

  const goToPrevItem = useCallback(() => {
    dispatch(setCurrentTakingSurveyItem({ surveyItemId: prevItem?.uuid }));
  }, [dispatch, prevItem]);

  return {
    prevItem,
    nextItem,
    currentItem,
    currentItemIndex,
    currentItemId,
    numItems,
    goToNextItem,
    goToPrevItem,
    ownResponses,
    firstItemWithoutResponse
  };
};