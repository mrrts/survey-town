import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IRequestErrorData } from "../../util/http.util";
import { isUndefined } from "lodash";

export enum RequestStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface IRequestState {
  key: string,
  state: RequestStatus,
  error?: IRequestErrorData
  shouldToastError?: boolean
}

export interface IRequestsState {
  requests: Record<string, IRequestState>
}

export const defaultRequestsState: IRequestsState = {
  requests: {}
}

export const slice = createSlice({
  name: 'requests',
  initialState: defaultRequestsState,
  reducers: {
    requestStart(state: IRequestsState, action: PayloadAction<{ key: string }>) {
      state.requests[action.payload.key] = {
        key: action.payload.key,
        state: RequestStatus.PENDING,
        error: undefined,
        shouldToastError: false
      }
    },
    requestSuccess(state: IRequestsState, action: PayloadAction<{ key: string }>) {
      if (state.requests?.[action.payload.key]) {
        state.requests[action.payload.key].state = RequestStatus.SUCCESS;
        state.requests[action.payload.key].error = undefined;
      }
    },
    requestError(state: IRequestsState, action: PayloadAction<{ key: string, error: IRequestErrorData, shouldToastError?: boolean }>) {
      if (state.requests?.[action.payload.key]) {
        state.requests[action.payload.key].state = RequestStatus.ERROR; 
        state.requests[action.payload.key].error = action.payload.error; 
        state.requests[action.payload.key].shouldToastError = isUndefined(action.payload.shouldToastError)
          ? true
          : action.payload.shouldToastError; 
      }
    }
  }
});

export const {
  requestStart,
  requestSuccess,
  requestError
} = slice.actions;

export const requestsReducer = slice.reducer;