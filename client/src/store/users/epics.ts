import { getType } from "@reduxjs/toolkit";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { concat, mergeMap, Observable, of, from, switchMap, catchError } from "rxjs";
import { AppState } from "..";
import { IUser } from "../../entities/user.model";
import { RequestError } from "../../util/http.util";
import { requestError, requestStart, requestSuccess } from "../requests/slice";
import { fetchUserHandles } from "./api";
import { receiveHandles, fetchUserHandles as fetchUserHandlesAction } from "./slice";

export const fetchAllHandlesEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(fetchUserHandlesAction)) as any,
    mergeMap((action: Action) => {
      const key = 'fetch_all_handles';
      return concat(
        of(requestStart({ key })),
        from(fetchUserHandles()).pipe(
          switchMap((handles: Partial<IUser>[]) => {
            return concat(
              of(requestSuccess({ key })),
              of(receiveHandles({ handles }))
            );
          }),
          catchError((err: RequestError) => {
            return of(requestError({ key, error: err.data }));
          })
        )
      );
    })
  );