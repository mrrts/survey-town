import { catchError, concat, from, Observable, of, switchMap, tap } from "rxjs";
import { Action } from 'redux';
import { AppState } from "..";
import { ofType } from "redux-observable";
import { setUser, unsetUser } from './slice';
import { login, logout } from './http';
import { PayloadAction } from "@reduxjs/toolkit";
import { LoginDto } from "../../entities/dtos/login.dto";
import { requestError, requestStart, requestSuccess } from "../requests/slice";
import { User } from "../../entities/user.model";
import { navigate } from '@reach/router';

export const loginEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType('auth/loginUser') as any,
    switchMap((action: PayloadAction<{ dto: LoginDto }>) => {
      const key = `login_${action.payload.dto.emailAddress}`;
      return concat(
        of(requestStart({ key })),
        from(login(action.payload.dto)).pipe(
          switchMap((user: User) => {
            return concat(
              of(requestSuccess({ key })),
              of(setUser({ user })),
            );
          }),
          catchError((err: any) => {
            return of(requestError({ key, error: err.message }))
          })
        )
      )
    })
  );

export const logoutEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType('auth/logoutUser') as any,
    switchMap((action: Action) => {
      const key = 'logout';
      return concat(
        of(requestStart({ key })),
        from(logout()).pipe(
          switchMap((resp: any) => {
            return concat(
              of(requestSuccess({ key })),
              of(unsetUser())
            );
          }),
          catchError((err: any) => {
            return of(requestError({ key, error: err.message }));
          })
        )
      );
    })
  );