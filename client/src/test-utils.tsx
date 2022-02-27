import React, { FC, useEffect } from 'react';
import { act, fireEvent, render, RenderResult, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { AppState, defaultAppState, rootReducer } from "./store";
import { configureStore } from '@reduxjs/toolkit';
import { createHistory, createMemorySource, History, LocationProvider } from '@reach/router';
import { defaultAuthState } from './store/auth/slice';
import { IUser } from './entities/user.model';
import { FormProvider, useForm } from 'react-hook-form';
import { keys } from 'lodash';

export const testUser: IUser = {
  uuid: 'test-user-uuid',
  handle: 'Test_User_1',
  emailAddress: 'testuser@test.com',
  roles: ['USER'],
} as IUser;

// default to logged-in state (truthy auth.user)
export const defaultTestAppState: AppState = {
  ...defaultAppState,
  auth: {
    ...defaultAuthState,
    user: testUser
  }
}

// wrapper to render an element with a store and location context
export const customRender = (
  child: React.ReactElement,
  initialState: Partial<AppState> = defaultTestAppState,
  route: string = '/'
) => {
  const mockStore = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...defaultTestAppState,
      ...initialState
    },
    middleware: []
  });

  jest.spyOn(mockStore, 'dispatch');

  const history: History = createHistory(createMemorySource(route));

  const renderResultUtils: RenderResult = render(
    <LocationProvider history={history}>
      <Provider store={mockStore}>
        {child}
      </Provider>
    </LocationProvider>
  );

  return { mockStore, history, ...renderResultUtils };
}

// pause test execution so that time can elapse in a tested component containing timeouts/intervals
export const wait = async (ms: number): Promise<void> => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, ms));
  });
}

// log rendered screen DOM to test runner shell
export const debug = () => screen.debug();

// shorthand utilities
export const query = (selector: string) => document.querySelector(selector);
export const queryAll = (selector: string) => document.querySelectorAll(selector);

export const setFieldValue = (element: Element|null, value: string) => {
  act(() => {
    fireEvent.change(element as Element, { target: { value }});
  });
}

export const click = (element: Element|null) => {
  act(() => {
    fireEvent.click(element as Element);
  });
}

export const FormContextConsumerWrapper: FC<any> = ({ children, errors }) => {
  const form = useForm();
  
  useEffect(() => {
    keys(errors || {}).forEach((key: string) => {
      form.setError(key, { message: errors[key] })
    });
  }, [errors, form])

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}