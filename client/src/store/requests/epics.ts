import { getType, PayloadAction } from "@reduxjs/toolkit";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { Observable, of, switchMap, tap } from "rxjs";
import { AppState } from "..";
import { IRequestErrorData } from "../../util/http.util";
import { toastDanger } from "../../util/toast.util";
import { requestError } from "./slice";

export const requestErrorEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(requestError)) as any,
    switchMap((action: PayloadAction<{ key: string, error: IRequestErrorData, shouldToastError: boolean }>) => {
      return of({ type: 'emptyAction' }).pipe(
        tap(() => {
          if (action.payload.shouldToastError) {
            toastDanger(action.payload.error?.message);
          }
        })
      );
    })
  );