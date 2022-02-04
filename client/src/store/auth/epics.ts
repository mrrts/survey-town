import { Observable, of, switchMap } from "rxjs";
import { Action } from 'redux';
import { AppState } from "..";
import { ofType } from "redux-observable";

export const loginEpic = (action$: Observable<Action>, state$: Observable<AppState>) =>
  action$.pipe(
    ofType('auth/login'),
    switchMap(action => {
      return of({ type: 'testing' });
    })
  )