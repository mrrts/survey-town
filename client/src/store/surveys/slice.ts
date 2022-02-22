import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISurveyItem } from "../../entities/survey-item.model";
import { ISurveyResponse } from "../../entities/survey-response.model";
import { ISurvey } from "../../entities/survey.model";
import { keyBy, filter, keys } from 'lodash';
import { CreateSurveyDto } from "../../entities/dtos/create-survey.dto";
import { UpdateSurveyDto } from "../../entities/dtos/update-survey.dto";
import { CreateSurveyItemDto } from "../../entities/dtos/create-survey-item.dto";
import { UpdateSurveyItemDto } from "../../entities/dtos/update-survey-item.dto";
import { CreateResponseDto } from "../../entities/dtos/create-response.dto";

export interface ISurveysState {
  surveys: Record<string, ISurvey>;
  surveyItems: Record<string, ISurveyItem>;
  anonSurveyResponses: Record<string, ISurveyResponse>; // anon == anonymous
  ownResponses: Record<string, ISurveyResponse>;
  currentTakingSurveyItem: string|null;
  takingSurveySubmittedItemData: Record<string, any>;
}

export const defaultSurveysState: ISurveysState = {
  surveys: {},
  surveyItems: {},
  anonSurveyResponses: {},
  ownResponses: {},
  currentTakingSurveyItem: null,
  takingSurveySubmittedItemData: {}
};

const slice = createSlice({
  name: 'surveys',
  initialState: defaultSurveysState,
  reducers: {
    fetchSurveys() {
      // triggers epic
    },
    fetchOwnResponsesForSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      // triggers epic
    },
    fetchResponsesForSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      // triggers epic
    },
    createSurvey(state: ISurveysState, action: PayloadAction<{ dto: CreateSurveyDto }>) {
      // triggers epic
    },
    updateSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string, dto: UpdateSurveyDto }>) {
      // triggers epic
    },
    createSurveyItem(state: ISurveysState, action: PayloadAction<{ surveyId: string, dto: CreateSurveyItemDto }>) {
      // triggers epic
    },
    updateSurveyItem(state: ISurveysState, action: PayloadAction<{ surveyId: string, surveyItemId: string, dto: UpdateSurveyItemDto }>) {
      // triggers epic
    },
    createResponse(state: ISurveysState, action: PayloadAction<{ surveyId: string, surveyItemId: string, dto: CreateResponseDto }>) {
      // triggers epic
    },
    deleteOwnResponsesForSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      // triggers epic
    },
    destroySurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      // triggers epic
    },
    destroySurveyItem(state: ISurveysState, action: PayloadAction<{ surveyId: string, surveyItemId: string }>) {
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
      state.anonSurveyResponses = {
        ...state.anonSurveyResponses,
        ...keyBy(action.payload.surveyResponses, 'uuid')
      };
    },
    receiveOwnResponses(state: ISurveysState, action: PayloadAction<{ surveyResponses: ISurveyResponse[] }>) {
      state.ownResponses = {
        ...state.ownResponses,
        ...keyBy(action.payload.surveyResponses, 'uuid')
      };
    },
    setCurrentTakingSurveyItem(state: ISurveysState, action: PayloadAction<{ surveyItemId: string }>) {
      state.currentTakingSurveyItem = action.payload.surveyItemId;
    },
    setTakingItemData(state: ISurveysState, action: PayloadAction<{ surveyItemId: string, data: any }>) {
      state.takingSurveySubmittedItemData[action.payload.surveyItemId] = action.payload.data;
    },
    clearAllTakingSurveyData(state: ISurveysState) {
      state.takingSurveySubmittedItemData = defaultSurveysState.takingSurveySubmittedItemData;
      state.currentTakingSurveyItem = null;
    },
    clearOwnResponses(state: ISurveysState) {
      state.ownResponses = {};
    },
    clearResponsesForSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      keys(state.anonSurveyResponses).forEach((responseId: string) => {
        if (state.anonSurveyResponses[responseId].survey === action.payload.surveyId) {
          delete state.anonSurveyResponses[responseId];
        }
      });
    },
    removeSurvey(state: ISurveysState, action: PayloadAction<{ surveyId: string }>) {
      delete state.surveys[action.payload.surveyId];
    },
    removeSurveyItem(state: ISurveysState, action: PayloadAction<{ surveyId: string, surveyItemId: string }>) {
      state.surveys[action.payload.surveyId].surveyItems = filter(
        state.surveys[action.payload.surveyId].surveyItems,
        (itemId: string) => itemId !== action.payload.surveyItemId
      );
      delete state.surveyItems[action.payload.surveyItemId];
    }
  }
});

export const {
  fetchSurveys,
  fetchOwnResponsesForSurvey,
  fetchResponsesForSurvey,
  createSurvey,
  updateSurvey,
  createSurveyItem,
  updateSurveyItem,
  createResponse,
  deleteOwnResponsesForSurvey,
  destroySurvey,
  destroySurveyItem,
  receiveSurveys,
  receiveSurveyItems,
  receiveSurveyResponses,
  receiveOwnResponses,
  setCurrentTakingSurveyItem,
  setTakingItemData,
  clearAllTakingSurveyData,
  clearOwnResponses,
  clearResponsesForSurvey,
  removeSurvey,
  removeSurveyItem
} = slice.actions;

export const surveysReducer = slice.reducer;
