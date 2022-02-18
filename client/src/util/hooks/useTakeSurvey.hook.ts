import { useAppDispatch, useAppSelector } from "../../store";
import { getCurrentTakingSurveyItem, getOwnResponsesForSurvey, getTakingSurveySubmittedItemData } from "../../store/surveys/selectors";
import { useSurvey } from "./useSurvey.hook";
import { findIndex, find, keys, compact, forEach } from 'lodash';
import { ISurveyItem } from "../../entities/survey-item.model";
import { useCallback, useMemo } from "react";
import { clearAllTakingSurveyData, createResponse, deleteOwnResponsesForSurvey, setCurrentTakingSurveyItem, setTakingItemData } from "../../store/surveys/slice";
import { ISurveyResponse } from "../../entities/survey-response.model";
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

  const progressPercentage = Math.floor(((currentItemIndex + 1) / (numItems || 1)) * 100);

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

  const responseSubmissionActions = useMemo(() => {
    return compact(keys(takingSurveySubmittedValues).map((itemId: string) => {
      if (!takingSurveySubmittedValues[itemId].responseType) {
        return undefined;
      }
      return createResponse({
        surveyId,
        surveyItemId: itemId,
        dto: takingSurveySubmittedValues[itemId]
      });
    }));
  }, [takingSurveySubmittedValues, surveyId]);

  const submitResponses = useCallback(() => {
    forEach(responseSubmissionActions, (action: PayloadAction<any>) => {
      dispatch(action);
    });
    dispatch(clearAllTakingSurveyData());
  }, [dispatch, responseSubmissionActions]);

  const goToFirstItem = useCallback(() => {
    const firstItemId = surveyItems[0]?.uuid;
    dispatch(setCurrentTakingSurveyItem({ surveyItemId: firstItemId }));
  }, [dispatch, surveyItems]);

  const goToNextItem = useCallback(() => {
    if (!!nextItem) {
      dispatch(setCurrentTakingSurveyItem({ surveyItemId: nextItem?.uuid }));
      return;
    }
  }, [dispatch, nextItem]);

  const goToPrevItem = useCallback(() => {
    if (!!prevItem) {
      dispatch(setCurrentTakingSurveyItem({ surveyItemId: prevItem?.uuid }));
    }
  }, [dispatch, prevItem]);

  const setItemResponseData = useCallback((surveyItemId: string, data: any) => {
    dispatch(setTakingItemData({ surveyItemId, data }));
  }, [dispatch]);

  const deleteOwnResponses = useCallback(() => {
    dispatch(deleteOwnResponsesForSurvey({ surveyId }))
  }, [dispatch, surveyId]);

  return {
    prevItem,
    nextItem,
    currentItem,
    currentItemType,
    currentItemIndex,
    currentItemId,
    numItems,
    goToFirstItem,
    goToNextItem,
    goToPrevItem,
    ownResponses,
    progressPercentage,
    firstItemWithoutResponse,
    hasNextItem,
    isLastItem,
    setItemResponseData,
    currentItemSubmittedValues,
    submitResponses,
    deleteOwnResponses
  };
};