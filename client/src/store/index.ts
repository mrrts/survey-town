import { configureStore } from "@reduxjs/toolkit";
import { Middleware } from 'redux';
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { authReducer } from "./auth/slice";
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();

const middlewares: Middleware[] = [
  createLogger({
    collapsed: true
  }),
  epicMiddleware
];

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      middlewares as ReturnType<typeof getDefaultMiddleware>
    );
  }
});

const rootEpic = combineEpics();
epicMiddleware.run(rootEpic);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// conveniently typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;