import { AppState } from "..";
import { ISurveysState } from "./slice";
import { orderBy, sortBy, values, filter } from 'lodash';
import { createSelector } from "@reduxjs/toolkit";
import { ISurveyItem } from "../../entities/survey-item.model";
import { ISurveyResponse } from "../../entities/survey-response.model";

export const getSurveysState = (state: AppState) => state.surveys;

export const getSurveys = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.surveys
);

export const getSurveysByDateDesc = createSelector(
  getSurveys,
  (surveys: ISurveysState['surveys']) => orderBy(
    values(surveys),
    ['createdAt'],
    ['desc']
  )
);

export const getSurveyItems = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.surveyItems
);

export const getSurveyById = (surveyId: string) => createSelector(
  getSurveys,
  (surveys: ISurveysState['surveys']) => surveys[surveyId]
);

export const getSurveyItemsBySurveyId = (surveyId: string) => createSelector(
  getSurveysState,
  (surveysState: ISurveysState): ISurveyItem[] => {
    const surveyItemIds = surveysState.surveys?.[surveyId]?.surveyItems || [];
    const surveyItems = surveyItemIds.map((surveyItemId: string) => {
      return surveysState.surveyItems?.[surveyItemId];
    });
    return sortBy(surveyItems, (item: ISurveyItem) => {
      return surveyItemIds.indexOf(item?.uuid);
    });
  }
);

export const getSurveyItemById = (surveyItemId: string) => createSelector(
  getSurveyItems,
  (surveyItems: ISurveysState['surveyItems']): ISurveyItem => {
    return surveyItems[surveyItemId];
  }
);

export const getOwnResponses = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.ownResponses
);

export const getAnonResponses = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.anonSurveyResponses
);

export const getOwnResponsesForSurvey = (surveyId: string) => createSelector(
  getOwnResponses,
  (ownResponses: ISurveysState['ownResponses']): ISurveyResponse[] => {
    return filter(
      values(ownResponses),
      (resp: ISurveyResponse) => resp.survey === surveyId
    );
  }
);

export const getCurrentTakingSurveyItem = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.currentTakingSurveyItem
);

export const getTakingSurveySubmittedItemData = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.takingSurveySubmittedItemData
);

export const getResponsesForSurveyItem = (surveyItemId: string) => createSelector(
  getAnonResponses,
  (anonResponses: Record<string, ISurveyResponse>): ISurveyResponse[] => filter(
    values(anonResponses),
    (resp: ISurveyResponse) => resp.surveyItem === surveyItemId
  )
);
