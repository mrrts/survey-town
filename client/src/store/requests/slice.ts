import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IRequestErrorData } from "../../util/http.util";

export enum RequestStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface IRequestState {
  key: string,
  state: RequestStatus,
  error?: IRequestErrorData
}

export interface IRequestsState {
  requests: Record<string, IRequestState>
}

export const defaultRequestsState: IRequestsState = {
  requests: {}
}

const slice = createSlice({
  name: 'requests',
  initialState: defaultRequestsState,
  reducers: {
    requestStart(state: IRequestsState, action: PayloadAction<{ key: string }>) {
      state.requests[action.payload.key] = {
        key: action.payload.key,
        state: RequestStatus.PENDING,
        error: undefined
      }
    },
    requestSuccess(state: IRequestsState, action: PayloadAction<{ key: string }>) {
      if (state.requests?.[action.payload.key]) {
        state.requests[action.payload.key].state = RequestStatus.SUCCESS;
        state.requests[action.payload.key].error = undefined;
      }
    },
    requestError(state: IRequestsState, action: PayloadAction<{ key: string, error: IRequestErrorData }>) {
      if (state.requests?.[action.payload.key]) {
        state.requests[action.payload.key].state = RequestStatus.ERROR; 
        state.requests[action.payload.key].error = action.payload.error; 
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