import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { ISurveyItem } from "../../entities/survey-item.model";
import { ISurveyResponse } from "../../entities/survey-response.model";
import { ISurvey } from "../../entities/survey.model";
import { keyBy, orderBy, sortBy, values } from 'lodash';
import { AppState } from '..';

export interface ISurveysState {
  surveys: Record<string, ISurvey>;
  surveyItems: Record<string, ISurveyItem>;
  surveyResponses: Record<string, ISurveyResponse>;
}

export const defaultSurveysState: ISurveysState = {
  surveys: {},
  surveyItems: {},
  surveyResponses: {}
};

const slice = createSlice({
  name: 'surveys',
  initialState: defaultSurveysState,
  reducers: {
    fetchSurveys() {
      // triggers epic
    },
    fetchSurveyResponses() {
      // triggers epic
    },
    receiveSurveys(state: ISurveysState, action: PayloadAction<{ surveys: ISurvey[] }>) {
      state.surveys = {
        ...state.surveys,
        ...keyBy(action.payload.surveys, 'uuid')
      };
    },
    receiveSurveyItems(state: ISurveysState, action: PayloadAction<{ surveyItems: ISurveyItem[] }>) {
      state.surveyItems = {
        ...state.surveyItems,
        ...keyBy(action.payload.surveyItems, 'uuid')
      };
    },
    receiveSurveyResponses(state: ISurveysState, action: PayloadAction<{ surveyResponses: ISurveyResponse[] }>) {
      state.surveyResponses = {
        ...state.surveyResponses,
        ...keyBy(action.payload.surveyResponses, 'uuid')
      };
    }
  }
});

export const {
  fetchSurveys,
  fetchSurveyResponses,
  receiveSurveys,
  receiveSurveyItems,
  receiveSurveyResponses
} = slice.actions;

export const surveysReducer = slice.reducer;

// Selectors

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
)