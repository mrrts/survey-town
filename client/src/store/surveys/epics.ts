import { getType, PayloadAction } from "@reduxjs/toolkit";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { concat, mergeMap, Observable, of, from, switchMap, catchError, tap } from "rxjs";
import { AppState } from "..";
import { ISurveyDto, SurveyDto } from "../../entities/dtos/survey.dto";
import { requestError, requestStart, requestSuccess } from "../requests/slice";
import * as api from "./api";
import { receiveSurveyItems, receiveSurveys, fetchSurveys as fetchSurveysAction, createSurvey, updateSurvey, createSurveyItem } from "./slice";
import { flatMap } from 'lodash';
import { RequestError } from "../../util/http.util";
import { Survey } from "../../entities/survey.model";
import { CreateSurveyDto } from "../../entities/dtos/create-survey.dto";
import { UpdateSurveyDto } from "../../entities/dtos/update-survey.dto";
import { toastSuccess } from "../../util/toast.util";
import { navigate } from "@reach/router";
import { CreateSurveyItemDto } from "../../entities/dtos/create-survey-item.dto";

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
          catchError((err: RequestError) => {
            return of(requestError({ key, error: err.data }))
          })
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
          catchError((err: RequestError) => {
            return of(requestError({ key, error: err.data }));
          })
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
          catchError((err: RequestError) => {
            return of(requestError({ key, error: err.data }));
          })
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
          catchError((err: RequestError) => {
            return of(requestError({ key, error: err.data }));
          })
        )
      );
    })
  );
