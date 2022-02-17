import { configureStore } from "@reduxjs/toolkit";
import { Middleware } from 'redux';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer } from "./auth/slice";
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import * as authEpics from './auth/epics';
import * as surveyEpics from './surveys/epics';
import * as userEpics from './users/epics';
import * as requestEpics from './requests/epics';
import { values } from 'lodash';
import { requestsReducer } from "./requests/slice";
import { surveysReducer } from "./surveys/slice";
import { usersReducer } from "./users/slice";
import { modalsReducer } from "./modals/slice";

const loggerMiddleware = createLogger({ collapsed: true });
const epicMiddleware = createEpicMiddleware();

const middlewares: Middleware[] = [
  loggerMiddleware,
  epicMiddleware
];

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requests: requestsReducer,
    surveys: surveysReducer,
    users: usersReducer,
    modals: modalsReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat(
      middlewares as ReturnType<typeof getDefaultMiddleware>
    );
  }
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