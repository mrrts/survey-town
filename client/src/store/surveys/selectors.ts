import { AppState } from "..";
import { ISurveysState } from "./slice";
import { orderBy, sortBy, values } from 'lodash';
import { createSelector } from "@reduxjs/toolkit";
import { ISurveyItem } from "../../entities/survey-item.model";

export const getSurveysState = (state: AppState) => state.surveys;

export const getSurveysByDateDesc = createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => orderBy(
    values(surveysState.surveys),
    ['createdAt'],
    ['desc']
  )
);

export const getSurveyById = (surveyId: string) => createSelector(
  getSurveysState,
  (surveysState: ISurveysState) => surveysState.surveys?.[surveyId]
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
  getSurveysState,
  (surveysState: ISurveysState): ISurveyItem => {
    return surveysState.surveyItems?.[surveyItemId];
  }
);