import { useAppDispatch, useAppSelector } from "../../store";
import { getCurrentTakingSurveyItem, getOwnResponsesForSurvey, getTakingSurveySubmittedItemData } from "../../store/surveys/selectors";
import { useSurvey } from "./useSurvey.hook";
import { findIndex, find, keys, compact, forEach } from 'lodash';
import { ISurveyItem } from "../../entities/survey-item.model";
import { useCallback, useMemo } from "react";
import { clearAllTakingSurveyData, createResponse, setCurrentTakingSurveyItem, setTakingItemData } from "../../store/surveys/slice";
import { ISurveyResponse, SurveyResponseType } from "../../entities/survey-response.model";
import { PayloadAction } from "@reduxjs/toolkit";

export const useTakeSurvey = (surveyId: string) => {
  const dispatch = useAppDispatch();
  const { surveyItems } = useSurvey(surveyId);
  const currentItemId = useAppSelector(getCurrentTakingSurveyItem);
  const ownResponsesSelector = useMemo(() => getOwnResponsesForSurvey(surveyId), [surveyId]);
  const ownResponses = useAppSelector(ownResponsesSelector);
  const numItems = surveyItems.length;
  const takingSurveySubmittedValues = useAppSelector(getTakingSurveySubmittedItemData);

  const currentItemSubmittedValues = takingSurveySubmittedValues[currentItemId as string];

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
  const hasNextItem = !!nextItem;
  const isLastItem = !!currentItem && !hasNextItem;

  const currentItemType = currentItem?.itemType;

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

  const responseSubmissionActions =
    compact(keys(takingSurveySubmittedValues).map((itemId: string) => {
      if (!takingSurveySubmittedValues[itemId].responseType) {
        return undefined;
      }
      return createResponse({
        surveyId,
        surveyItemId: itemId,
        dto: takingSurveySubmittedValues[itemId]
      });
    }));

  const submitResponses = () => {
    console.log({ responseSubmissionActions, takingSurveySubmittedValues })
    forEach(responseSubmissionActions, (action: PayloadAction<any>) => {
      dispatch(action);
    });
    dispatch(clearAllTakingSurveyData);
  };

  const goToNextItem = useCallback(() => {
    if (hasNextItem) {
      dispatch(setCurrentTakingSurveyItem({ surveyItemId: nextItem?.uuid }));
      return;
    }
  }, [dispatch, nextItem, hasNextItem]);

  const goToPrevItem = useCallback(() => {
    dispatch(setCurrentTakingSurveyItem({ surveyItemId: prevItem?.uuid }));
  }, [dispatch, prevItem]);

  const setItemResponseData = useCallback((surveyItemId: string, data: any) => {
    dispatch(setTakingItemData({ surveyItemId, data }));
  }, [dispatch]);

  return {
    prevItem,
    nextItem,
    currentItem,
    currentItemType,
    currentItemIndex,
    currentItemId,
    numItems,
    goToNextItem,
    goToPrevItem,
    ownResponses,
    firstItemWithoutResponse,
    hasNextItem,
    isLastItem,
    setItemResponseData,
    currentItemSubmittedValues,
    submitResponses
  };
};