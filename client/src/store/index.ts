import { configureStore } from "@reduxjs/toolkit";
import { Middleware } from 'redux';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer, defaultAuthState } from "./auth/slice";
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import * as authEpics from './auth/epics';
import * as surveyEpics from './surveys/epics';
import * as userEpics from './users/epics';
import * as requestEpics from './requests/epics';
import { values } from 'lodash';
import { requestsReducer, defaultRequestsState } from "./requests/slice";
import { surveysReducer, defaultSurveysState } from "./surveys/slice";
import { usersReducer, defaultUsersState } from "./users/slice";
import { modalsReducer, defaultModalsState } from "./modals/slice";
import { defaultUiState, uiReducer } from "./ui/slice";

const loggerMiddleware = createLogger({ collapsed: true });
const epicMiddleware = createEpicMiddleware();

const middlewares: Middleware[] = [
  epicMiddleware
];

if (process.env.REACT_APP_ENV === 'development') {
  middlewares.push(loggerMiddleware);
}

export const rootReducer = {
  auth: authReducer,
  requests: requestsReducer,
  surveys: surveysReducer,
  users: usersReducer,
  modals: modalsReducer,
  ui: uiReducer
};

export const defaultAppState = {
  auth: defaultAuthState,
  requests: defaultRequestsState,
  surveys: defaultSurveysState,
  users: defaultUsersState,
  modals: defaultModalsState,
  ui: defaultUiState
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      middlewares as ReturnType<typeof getDefaultMiddleware>
    );
  },
  preloadedState: defaultAppState
});

const rootEpic = combineEpics(
  ...values(authEpics),
  ...values(surveyEpics),
  ...values(userEpics),
  ...values(requestEpics)
);
epicMiddleware.run(rootEpic);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// conveniently typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;