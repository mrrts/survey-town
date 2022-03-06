import { catchError, concat, from, Observable, of, switchMap, tap } from "rxjs";
import { Action } from 'redux';
import { AppState } from "..";
import { ofType } from "redux-observable";
import { loginUser, logoutUser, registerUser, restoreSession, setUser, unsetUser } from './slice';
import * as api from './api';
import { PayloadAction, getType } from "@reduxjs/toolkit";
import { LoginDto } from "../../entities/dtos/login.dto";
import { requestError, requestStart, requestSuccess } from "../requests/slice";
import { User } from "../../entities/user.model";
import { RequestError } from "../../util/http.util";
import { fetchUserHandles } from "../users/slice";
import { RegisterDto } from "../../entities/dtos/register.dto";
import { navigate } from "@reach/router";
import { clearOwnResponses, fetchSurveys } from "../surveys/slice";

export const loginEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(loginUser)) as any,
    switchMap((action: PayloadAction<{ dto: LoginDto }>) => {
      const key = 'login';
      return concat(
        of(requestStart({ key })),
        from(api.login(action.payload.dto)).pipe(
          switchMap((user: User|null) => {
            return concat(
              of(requestSuccess({ key })),
              of(setUser({ user })),
              of(fetchUserHandles()),
              of(fetchSurveys()).pipe(
                tap(() => navigate('/surveys'))
              )
            );
          }),
          catchError((error: RequestError) => {
            return of(requestError({ key, error: error.data }))
          })
        )
      )
    })
  );

export const logoutEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(logoutUser)),
    switchMap((action: Action) => {
      const key = 'logout';
      return concat(
        of(requestStart({ key })),
        from(api.logout()).pipe(
          switchMap((resp: any) => {
            return concat(
              of(requestSuccess({ key })),
              of(unsetUser()).pipe(
                tap(() => navigate('/'))
              ),
              of(clearOwnResponses())
            );
          }),
          catchError((error: RequestError) => {
            return of(requestError({ key, error: error.data }));
          })
        )
      );
    })
  );

export const restoreSessionEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(getType(restoreSession)),
    switchMap(action => {
      const key = 'restore_session';
      return concat(
        of(requestStart({ key })),
        from(api.getSelf()).pipe(
          switchMap((user: User|null) => {
            return concat(
              of(requestSuccess({ key })),
              of(setUser({ user })),
              of(fetchUserHandles()),
              of(fetchSurveys())
            );
          }),
          catchError((error: RequestError) => {
            return of(requestError({ key, error: error.data, shouldToastError: false }))
          })
        )
      );
    })
  );

  export const registerUserEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
    action$.pipe(
      ofType(getType(registerUser)) as any,
      switchMap((action: PayloadAction<{ dto: RegisterDto }>) => {
        const key = 'register';
        return concat(
          of(requestStart({ key })),
          from(api.register(action.payload.dto)).pipe(
            switchMap((user: User|null) => {
              return concat(
                of(requestSuccess({ key })),
                of(loginUser({ 
                  dto: { 
                    emailAddress: action.payload.dto.emailAddress,
                    plaintextPassword: action.payload.dto.plaintextPassword 
                  }}
                ))
              );
            }),
            catchError((error: RequestError) => {
              return of(requestError({ key, error: error.data }));
            })
          )
        );
      })
    );