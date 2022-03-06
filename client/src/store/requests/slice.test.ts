import {
  requestsReducer,
  RequestStatus,
  defaultRequestsState,
  IRequestsState,
  requestStart,
  requestSuccess,
  requestError
} from "./slice";

describe('requests reducer', () => {
  let state: IRequestsState;

  beforeEach(() => {
    state = {
      requests: {
        create_survey: {
          key: 'create_survey',
          state: RequestStatus.PENDING,
          error: undefined,
          shouldToastError: false
        }
      }
    };
  });

  test('requestStart', () => {
    const action = requestStart({ key: 'update_survey_survey1' });
    const newState = requestsReducer(state, action);
    expect(newState.requests.update_survey_survey1).toEqual({
      key: 'update_survey_survey1',
      state: RequestStatus.PENDING,
      error: undefined,
      shouldToastError: false
    });
    expect(newState.requests.create_survey).toBe(state.requests.create_survey);
  });

  test('requestSuccess', () => {
    const action = requestSuccess({ key: 'create_survey' });
    const newState = requestsReducer(state, action);
    expect(newState.requests.create_survey).toEqual({
      key: 'create_survey',
      state: RequestStatus.SUCCESS,
      error: undefined,
      shouldToastError: false
    })
  });

  test('requestError', () => {
    const action = requestError({
      key: 'create_survey',
      error: { statusCode: 404, message: 'oops' },
      shouldToastError: true
    });
    const newState = requestsReducer(state, action);

    expect(newState.requests.create_survey).toEqual({
      key: 'create_survey',
      state: RequestStatus.ERROR,
      error: { statusCode: 404, message: 'oops' },
      shouldToastError: true
    });
  });
});