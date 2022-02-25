import React from 'react';
import { render, RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppState, defaultAppState, rootReducer } from "./store";
import { configureStore } from '@reduxjs/toolkit';

export const customRender = (child: React.ReactElement, initialState: Partial<AppState> = defaultAppState) => {
  const mockStore = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...defaultAppState,
      ...initialState
    }
  });

  jest.spyOn(mockStore, 'dispatch');

  const renderResult: RenderResult = render(
    <Provider store={mockStore}>
      {child}
    </Provider>
  );

  return { mockStore, renderResult };
}