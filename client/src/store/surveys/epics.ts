import { getType, PayloadAction } from "@reduxjs/toolkit";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { concat, mergeMap, Observable, of, from, switchMap, catchError, tap } from "rxjs";
import { AppState } from "..";
import { ISurveyDto, SurveyDto } from "../../entities/dtos/survey.dto";
import { requestError, requestStart, requestSuccess } from "../requests/slice";
import * as api from "./api";
import {
  receiveSurveyItems,
  receiveSurveys,
  fetchSurveys as fetchSurveysAction,
  createSurvey,
  updateSurvey,
  createSurveyItem,
  updateSurveyItem,
  fetchOwnResponsesForSurvey,
  receiveOwnResponses,
  createResponse,
  deleteOwnResponsesForSurvey,
  clearOwnResponses,
  destroySurvey,
  removeSurvey,
  destroySurveyItem,
  removeSurveyItem,
  fetchResponsesForSurvey,
  receiveSurveyResponses,
} from "./slice";
import { flatMap } from 'lodash';
import { RequestError } from "../../util/http.util";
import { Survey } from "../../entities/survey.model";
import { CreateSurveyDto } from "../../entities/dtos/create-survey.dto";
import { UpdateSurveyDto } from "../../entities/dtos/update-survey.dto";
import { CreateResponseDto } from "../../entities/dtos/create-response.dto";
import { toastSuccess } from "../../util/toast.util";
import { navigate } from "@reach/router";
import { CreateSurveyItemDto } from "../../entities/dtos/create-survey-item.dto";
import { UpdateSurveyItemDto } from "../../entities/dtos/update-survey-item.dto";
import { ISurveyResponse, SurveyResponse } from "../../entities/survey-response.model";

const handleRequestError = (key: string, shouldToastError: boolean = true) => (err: RequestError) =>
  of(requestError({ key, error: err.data, shouldToastError }));

export const fetchSurveysEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(fetchSurveysAction)) as any,
    mergeMap((action: Action) => {
      const key = 'fetch_surveys';
      return concat(
        of(requestStart({ key })),
        from(api.fetchSurveys()).pipe(
          switchMap((dtos: SurveyDto[] = []) => {
            const surveys = dtos.map(dto => {
              return new Survey({
                ...dto.survey,
                numberOfResponses: dto.numberOfResponses
              });
            });
            const surveyItems = flatMap(dtos, (dto: ISurveyDto) => dto.expandedItems);
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveys({ surveys })),
              of(receiveSurveyItems({ surveyItems }))
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const fetchOwnResponsesForSurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(fetchOwnResponsesForSurvey)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string }>) => {
      const key = `fetch_own_responses_for_survey_${action.payload.surveyId}`;
      return concat(
        of(requestStart({ key })),
        from(api.fetchOwnResponsesForSurvey(action.payload.surveyId)).pipe(
          switchMap((surveyResponses: ISurveyResponse[]) => {
            return concat(
              of(requestSuccess({ key })),
              of(receiveOwnResponses({ surveyResponses }))
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const fetchResponsesForSurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(fetchResponsesForSurvey)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string }>) => {
      const key = `fetch_responses_for_survey_${action.payload.surveyId}`;
      return concat(
        of(requestStart({ key })),
        from(api.fetchResponsesForSurvey(action.payload.surveyId)).pipe(
          switchMap((responses: SurveyResponse[]) => {
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveyResponses({ surveyResponses: responses }))
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const createSurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(createSurvey)) as any,
    mergeMap((action: PayloadAction<{ dto: CreateSurveyDto }>) => {
      const key = 'create_survey';
      return concat(
        of(requestStart({ key })),
        from(api.postSurvey(action.payload.dto)).pipe(
          switchMap((dto: SurveyDto) => {
            const survey = new Survey({
              ...dto.survey,
              numberOfResponses: dto.numberOfResponses
            });
            const surveyItems = dto.expandedItems;
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveys({ surveys: [survey] })),
              of(receiveSurveyItems({ surveyItems })).pipe(
                tap(() => {
                  toastSuccess(`Survey "${dto.survey.title}" created.`);
                  navigate(`/surveys/${survey.uuid}/edit`)
                })
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const updateSurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) => 
  action$.pipe(
    ofType(getType(updateSurvey)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string, dto: UpdateSurveyDto }>) => {
      const key = `update_survey_${action.payload.surveyId}`;
      return concat(
        of(requestStart({ key })),
        from(api.patchSurvey(action.payload.surveyId, action.payload.dto)).pipe(
          switchMap((dto: SurveyDto) => {
            const survey = new Survey({
              ...dto.survey,
              numberOfResponses: dto.numberOfResponses
            });
            const surveyItems = dto.expandedItems;
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveys({ surveys: [survey] })),
              of(receiveSurveyItems({ surveyItems })).pipe(
                tap(() => toastSuccess(`Survey "${dto.survey.title}" updated.`))
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const createSurveyItemEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(createSurveyItem)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string, dto: CreateSurveyItemDto }>) => {
      const key = 'create_survey_item';
      return concat(
        of(requestStart({ key })),
        from(api.postSurveyItem(action.payload.surveyId, action.payload.dto)).pipe(
          switchMap((dto: SurveyDto) => {
            const survey = new Survey({
              ...dto.survey,
              numberOfResponses: dto.numberOfResponses
            });
            const surveyItems = dto.expandedItems;
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveys({ surveys: [survey] })),
              of(receiveSurveyItems({ surveyItems })).pipe(
                tap(() => toastSuccess(`Item added to survey "${survey.title}"`))
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const updateSurveyItemEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(updateSurveyItem)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string, surveyItemId: string, dto: UpdateSurveyItemDto }>) => {
      const key = `update_survey_item_${action.payload.surveyItemId}`;
      return concat(
        of(requestStart({ key })),
        from(api.patchSurveyItem(action.payload.surveyId, action.payload.surveyItemId, action.payload.dto)).pipe(
          switchMap((dto: SurveyDto) => {
            const survey = new Survey({
              ...dto.survey,
              numberOfResponses: dto.numberOfResponses
            });
            const surveyItems = dto.expandedItems;
            return concat(
              of(requestSuccess({ key })),
              of(receiveSurveys({ surveys: [survey] })),
              of(receiveSurveyItems({ surveyItems })).pipe(
                tap(() => toastSuccess(`Item updated for survey "${survey.title}"`))
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const createResponseEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(createResponse)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string, surveyItemId: string, dto: CreateResponseDto }>) => {
      const key = `create_response_item_${action.payload.surveyItemId}`;
      return concat(
        of(requestStart({ key })),
        from(api.postResponse(action.payload.surveyId, action.payload.surveyItemId, action.payload.dto)).pipe(
          switchMap((surveyResponse: ISurveyResponse) => {
            return concat(
              of(requestSuccess({ key })),
              of(receiveOwnResponses({ surveyResponses: [surveyResponse] }))
            );
          }),
          catchError(handleRequestError(key, false))
        )
      );
    })
  );

export const deleteOwnResponsesForSurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(deleteOwnResponsesForSurvey)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string }>) => {
      const key = `delete_own_responses_survey_${action.payload.surveyId}`;
      return concat(
        of(requestStart({ key })),
        from(api.deleteOwnResponsesForSurvey(action.payload.surveyId)).pipe(
          switchMap(() => {
            return concat(
              of(requestSuccess({ key })),
              of(clearOwnResponses()),
              of(fetchSurveysAction())
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const destroySurveyEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(destroySurvey)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string }>) => {
      const key = `destroy_survey_${action.payload.surveyId}`;
      return concat(
        of(requestStart({ key })),
        from(api.deleteSurvey(action.payload.surveyId)).pipe(
          switchMap((resp: void) => {
            return concat(
              of(requestSuccess({ key })),
              of(removeSurvey({ surveyId: action.payload.surveyId })).pipe(
                tap(() => toastSuccess('Survey deleted'))
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );

export const destroySurveyItemEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(destroySurveyItem)) as any,
    mergeMap((action: PayloadAction<{ surveyId: string, surveyItemId: string }>) => {
      const key = `destroy_survey_item_${action.payload.surveyItemId}`;
      return concat(
        of(requestStart({ key })),
        from(api.deleteSurveyItem(action.payload.surveyId, action.payload.surveyItemId)).pipe(
          switchMap((resp: void) => {
            return concat(
              of(requestSuccess({ key })),
              of(removeSurveyItem({ surveyId: action.payload.surveyId, surveyItemId: action.payload.surveyItemId })).pipe(
                tap(() => toastSuccess('Item deleted from survey'))
              )
            );
          }),
          catchError(handleRequestError(key))
        )
      );
    })
  );