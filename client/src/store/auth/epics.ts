import { Observable, of, switchMap } from "rxjs";
import { Action } from 'redux';
import { AppState } from "..";
import { ofType } from "redux-observable";
import { login } from './slice';

export const loginEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType(login.type),
    switchMap(action => {
      return of({ type: 'testing' });
    })
  )