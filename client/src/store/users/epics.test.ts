import * as epics from './epics';
import * as slice from './slice';
import nock from 'nock';
import { nockScope } from '../../test-utils';
import { of, toArray } from 'rxjs';
import { AnyAction } from 'redux';
import { requestError, requestStart, requestSuccess } from '../requests/slice';

describe('User Epics', () => {
  let state$ = of({} as any);

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches all handles -- SUCCESS', (done) => {
    const resp = [
      { uuid: 'user1', handle: 'Handle_1' },
      { uuid: 'user2', handle: 'Handle_2' },
    ];
    
    nockScope.get('/users/handles')
      .reply(200, resp);

    const action$ = of(slice.fetchUserHandles());

    epics.fetchAllHandlesEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_all_handles' }),
        requestSuccess({ key: 'fetch_all_handles' }),
        slice.receiveHandles({ handles: resp })
      ]);
      done();
    });
  });
  
  it('fetches all handles -- ERROR', (done) => {
    nockScope.get('/users/handles')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.fetchUserHandles());

    epics.fetchAllHandlesEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_all_handles' }),
        requestError({
          key: 'fetch_all_handles',
          error: { statusCode: 404, message: 'oops' },
        })
      ]);
      done();
    });
  });

});