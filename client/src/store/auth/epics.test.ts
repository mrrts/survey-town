import { of, tap, toArray } from 'rxjs';
import { ILoginDto } from '../../entities/dtos/login.dto';
import * as epics from './epics';
import { loginUser, logoutUser, registerUser, restoreSession, setUser, unsetUser } from './slice';
import nock from 'nock';
import { requestError, requestStart, requestSuccess } from '../requests/slice';
import { fetchUserHandles } from '../users/slice';
import { clearOwnResponses, fetchSurveys } from '../surveys/slice';
import { AnyAction } from 'redux';
import { nockScope } from '../../test-utils';
import { RegisterDto } from '../../entities/dtos/register.dto';

describe('Auth Epics', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('logs in -- SUCCESS', (done) => {
    nockScope.post('/auth/login')
      .reply(200, { uuid: 'user1' });
  
    const dto: ILoginDto = {
      emailAddress: 'email@fake.com',
      plaintextPassword: 'p@ssw0rd1!'
    };

    const action$ = of(loginUser({ dto }));

    epics.loginEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'login' }),
        requestSuccess({ key: 'login' }),
        setUser({ user: expect.objectContaining({ uuid: 'user1' })}),
        fetchUserHandles(),
        fetchSurveys()
      ]);
      done();
    });
  });
  
  it('logs in -- ERROR', (done) => {
    nockScope.post('/auth/login')
      .reply(404, { message: 'oops', statusCode: 404 });
  
    const dto: ILoginDto = {
      emailAddress: 'email@fake.com',
      plaintextPassword: 'p@ssw0rd1!'
    };

    const action$ = of(loginUser({ dto }));

    epics.loginEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'login' }),
        requestError({ key: 'login', error: { message: 'oops', statusCode: 404 }})
      ]);
      done();
    });
  });

  it('logs out -- SUCCESS', (done) => {
    nockScope.get('/auth/logout')
      .reply(200);
  
    const action$ = of(logoutUser());

    epics.logoutEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'logout' }),
        requestSuccess({ key: 'logout' }),
        unsetUser(),
        clearOwnResponses()
      ]);
      done();
    });
  });
  
  it('logs out -- ERROR', (done) => {
    nockScope.get('/auth/logout')
      .reply(404, { statusCode: 404, message: 'oops' });
  
    const action$ = of(logoutUser());

    epics.logoutEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'logout' }),
        requestError({ key: 'logout', error: { statusCode: 404, message: 'oops' }})
      ]);
      done();
    });
  });

  it('restores session -- SUCCESS', (done) => {
    nockScope.get('/users/self')
      .reply(200, { uuid: 'user1' });
  
    const action$ = of(restoreSession());

    epics.restoreSessionEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'restore_session' }),
        requestSuccess({ key: 'restore_session' }),
        setUser({ user: expect.objectContaining({ uuid: 'user1' }) }),
        fetchUserHandles(),
        fetchSurveys()
      ]);
      done();
    });
  });
  
  it('restores session -- ERROR', (done) => {
    nockScope.get('/users/self')
      .reply(404, { statusCode: 404, message: 'oops' });
  
    const action$ = of(restoreSession());

    epics.restoreSessionEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'restore_session' }),
        requestError({
          key: 'restore_session',
          error: { statusCode: 404, message: 'oops' },
          shouldToastError: false 
        })
      ]);
      done();
    });
  });

  it('registers a user -- SUCCESS', (done) => {
    nockScope.post('/auth/register')
      .reply(200, { uuid: 'user1' });

    const dto: RegisterDto = { emailAddress: 'email@fake.com', handle: 'Handle_1', plaintextPassword: 'asdfjkl;' }
  
    const action$ = of(registerUser({ dto }));

    epics.registerUserEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'register' }),
        requestSuccess({ key: 'register' }),
        loginUser({ dto: { emailAddress: dto.emailAddress, plaintextPassword: dto.plaintextPassword }})
      ]);
      done();
    });
  });
  
  it('registers a user -- ERROR', (done) => {
    nockScope.post('/auth/register')
      .reply(404, { statusCode: 404, message: 'oops' });

    const dto: RegisterDto = { emailAddress: 'email@fake.com', handle: 'Handle_1', plaintextPassword: 'asdfjkl;' }
  
    const action$ = of(registerUser({ dto }));

    epics.registerUserEpic(action$, of({} as any)).pipe(
      toArray(),
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'register' }),
        requestError({ key: 'register', error: { statusCode: 404, message: 'oops' }})
      ]);
      done();
    });
  });
});