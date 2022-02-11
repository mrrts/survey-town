import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISurveyItem } from "../../entities/survey-item.model";
import { ISurveyResponse } from "../../entities/survey-response.model";
import { ISurvey } from "../../entities/survey.model";
import { keyBy } from 'lodash';
import { CreateSurveyDto } from "../../entities/dtos/create-survey.dto";
import { UpdateSurveyDto } from "../../entities/dtos/update-survey.dto";

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
    createSurvey(state: ISurveysState, action: PayloadAction<{ dto: CreateSurveyDto }>) {
      // triggers epic
    },
    updateSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string, dto: UpdateSurveyDto }>) {
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
  createSurvey,
  updateSurvey,
  receiveSurveys,
  receiveSurveyItems,
  receiveSurveyResponses
} = slice.actions;

export const surveysReducer = slice.reducer;
