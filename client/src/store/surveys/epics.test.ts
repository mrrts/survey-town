import * as epics from './epics';
import * as slice from './slice';
import { nockScope } from '../../test-utils';
import nock from 'nock';
import { of, toArray } from 'rxjs';
import { AnyAction } from 'redux';
import { requestError, requestStart, requestSuccess } from '../requests/slice';
import { Survey } from '../../entities/survey.model';
import { SurveyItem } from '../../entities/survey-item.model';
import { ISurveyResponse, SurveyResponse, SurveyResponseType } from '../../entities/survey-response.model';
import { ICreateSurveyDto } from '../../entities/dtos/create-survey.dto';
import { IUpdateSurveyDto } from '../../entities/dtos/update-survey.dto';
import { ICreateSurveyItemDto } from '../../entities/dtos/create-survey-item.dto';
import { SurveyItemType } from '../../constants/SurveyItemType.enum';
import { IUpdateSurveyItemDto } from '../../entities/dtos/update-survey-item.dto';

describe('Survey Epics', () => {
  let state$: any = of({});

  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches surveys -- SUCCESS', (done) => {
    const body = [
      {
        survey: { uuid: 'survey1' },
        numberOfResponses: 5,
        expandedItems: [{ uuid: 'item1' }, { uuid: 'item2' }]
      },
      {
        survey: { uuid: 'survey2' },
        numberOfResponses: 6,
        expandedItems: [{ uuid: 'item3' }]
      },
    ];

    nockScope.get('/surveys')
      .reply(200, body);

    const action$ = of(slice.fetchSurveys());

    epics.fetchSurveysEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_surveys' }),
        requestSuccess({ key: 'fetch_surveys' }),
        slice.receiveSurveys({ surveys: [expect.any(Survey), expect.any(Survey)] }),
        slice.receiveSurveyItems({
          surveyItems: [expect.any(SurveyItem), expect.any(SurveyItem), expect.any(SurveyItem)]
        })
      ]);
      done();
    });
  });
  
  it('fetches surveys -- ERROR', (done) => {
    nockScope.get('/surveys')
      .reply(404, { statusCode: 404 });

    const action$ = of(slice.fetchSurveys());

    epics.fetchSurveysEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_surveys' }),
        requestError({ key: 'fetch_surveys', error: { statusCode: 404 }, shouldToastError: true })
      ]);
      done();
    });
  });

  it('fetches own responses for survey -- SUCCESS', (done) => {
    const body = [
      {
        responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
        freeResponse: 'resp1',
        surveyItem: 'item1'
      },
      {
        responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
        freeResponse: 'resp2',
        surveyItem: 'item2'
      },
    ];

    nockScope.get('/surveys/survey1/own-responses')
      .reply(200, body);

    const action$ = of(slice.fetchOwnResponsesForSurvey({ surveyId: 'survey1' }));

    epics.fetchOwnResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_own_responses_for_survey_survey1' }),
        requestSuccess({ key: 'fetch_own_responses_for_survey_survey1' }),
        slice.receiveOwnResponses({ surveyResponses: [expect.any(SurveyResponse), expect.any(SurveyResponse)] })
      ]);
      done();
    });
  });
  
  it('fetches own responses for survey -- ERROR', (done) => {
    nockScope.get('/surveys/survey1/own-responses')
      .reply(404, { statusCode: 404 });

    const action$ = of(slice.fetchOwnResponsesForSurvey({ surveyId: 'survey1' }));

    epics.fetchOwnResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_own_responses_for_survey_survey1' }),
        requestError({
          key: 'fetch_own_responses_for_survey_survey1',
          error: { statusCode: 404 },
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('fetches responses for survey -- SUCCESS', (done) => {
    const body = [
      {
        responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
        freeResponse: 'resp1',
        surveyItem: 'item1'
      },
      {
        responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
        freeResponse: 'resp2',
        surveyItem: 'item2'
      },
    ];

    nockScope.get('/surveys/survey1/responses')
      .reply(200, body);

    const action$ = of(slice.fetchResponsesForSurvey({ surveyId: 'survey1' }));

    epics.fetchResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_responses_for_survey_survey1' }),
        requestSuccess({ key: 'fetch_responses_for_survey_survey1' }),
        slice.receiveSurveyResponses({ surveyResponses: [expect.any(SurveyResponse), expect.any(SurveyResponse)] })
      ]);
      done();
    });
  });
  
  it('fetches responses for survey -- ERROR', (done) => {
    nockScope.get('/surveys/survey1/responses')
      .reply(404, { statusCode: 404 });

    const action$ = of(slice.fetchResponsesForSurvey({ surveyId: 'survey1' }));

    epics.fetchResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'fetch_responses_for_survey_survey1' }),
        requestError({
          key: 'fetch_responses_for_survey_survey1',
          error: { statusCode: 404 },
          shouldToastError: true 
        })
      ]);
      done();
    });
  });

  it('creates a survey -- SUCCESS', (done) => {
    const dto: ICreateSurveyDto = {
      title: 'title1',
      description: 'desc1'
    };

    const resp = {
      survey: { ...dto, uuid: 'survey1' },
      numberOfResponses: 0,
      expandedItems: []
    };

    nockScope.post('/surveys')
      .reply(200, resp);

    const action$ = of(slice.createSurvey({ dto }));

    epics.createSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_survey' }),
        requestSuccess({ key: 'create_survey' }),
        slice.receiveSurveys({ surveys: [expect.any(Survey)] }),
        slice.receiveSurveyItems({ surveyItems: [] })
      ]);
      done();
    });
  });
  
  it('creates a survey -- ERROR', (done) => {
    const dto: ICreateSurveyDto = {
      title: 'title1',
      description: 'desc1'
    };

    nockScope.post('/surveys')
      .reply(404, { statusCode: 404 });

    const action$ = of(slice.createSurvey({ dto }));

    epics.createSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_survey' }),
        requestError({
          key: 'create_survey',
          error: { statusCode: 404 },
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('updates a survey -- SUCCESS', (done) => {
    const dto: IUpdateSurveyDto = {
      title: 'title1',
      description: 'desc1'
    };

    const resp = {
      survey: { ...dto, uuid: 'survey1' },
      numberOfResponses: 0,
      expandedItems: []
    };

    nockScope.options('/surveys/survey1')
      .reply(200);
    nockScope.patch('/surveys/survey1')
      .reply(200, resp);

    const action$ = of(slice.updateSurvey({ dto, surveyId: 'survey1' }));

    epics.updateSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'update_survey_survey1' }),
        requestSuccess({ key: 'update_survey_survey1' }),
        slice.receiveSurveys({ surveys: [expect.any(Survey)] }),
        slice.receiveSurveyItems({ surveyItems: [] })
      ]);
      done();
    });
  });
  
  it('updates a survey -- ERROR', (done) => {
    const dto: IUpdateSurveyDto = {
      title: 'title1',
      description: 'desc1'
    };

    nockScope.options('/surveys/survey1')
      .reply(200);
    nockScope.patch('/surveys/survey1')
      .reply(404, { statusCode: 404 });

    const action$ = of(slice.updateSurvey({ dto, surveyId: 'survey1' }));

    epics.updateSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'update_survey_survey1' }),
        requestError({
          key: 'update_survey_survey1',
          error: { statusCode: 404 },
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('creates a survey item -- SUCCESS', (done) => {
    const dto: ICreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1'
    };

    const resp = {
      survey: { ...dto, uuid: 'survey1' },
      numberOfResponses: 0,
      expandedItems: [{ ...dto }]
    };

    nockScope.post('/surveys/survey1/items')
      .reply(200, resp);

    const action$ = of(slice.createSurveyItem({ dto, surveyId: 'survey1' }));

    epics.createSurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_survey_item' }),
        requestSuccess({ key: 'create_survey_item' }),
        slice.receiveSurveys({ surveys: [expect.any(Survey)] }),
        slice.receiveSurveyItems({ surveyItems: [expect.any(SurveyItem)] })
      ]);
      done();
    });
  });
  
  it('creates a survey item -- ERROR', (done) => {
    const dto: ICreateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1'
    };

    nockScope.post('/surveys/survey1/items')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.createSurveyItem({ dto, surveyId: 'survey1' }));

    epics.createSurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_survey_item' }),
        requestError({
          key: 'create_survey_item',
          error: { statusCode: 404, message: 'oops' },
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('updates a survey item -- SUCCESS', (done) => {
    const dto: IUpdateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1'
    };

    const resp = {
      survey: { ...dto, uuid: 'survey1' },
      numberOfResponses: 0,
      expandedItems: [{ ...dto }]
    };

    nockScope.options('/surveys/survey1/items/item1')
      .reply(200);
    nockScope.patch('/surveys/survey1/items/item1')
      .reply(200, resp);

    const action$ = of(slice.updateSurveyItem({ dto, surveyItemId: 'item1', surveyId: 'survey1' }));

    epics.updateSurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'update_survey_item_item1' }),
        requestSuccess({ key: 'update_survey_item_item1' }),
        slice.receiveSurveys({ surveys: [expect.any(Survey)] }),
        slice.receiveSurveyItems({ surveyItems: [expect.any(SurveyItem)] })
      ]);
      done();
    });
  });
  
  it('updates a survey item -- ERROR', (done) => {
    const dto: IUpdateSurveyItemDto = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1'
    };

    nockScope.options('/surveys/survey1/items/item1')
      .reply(200);
    nockScope.patch('/surveys/survey1/items/item1')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.updateSurveyItem({ dto, surveyItemId: 'item1', surveyId: 'survey1' }));

    epics.updateSurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'update_survey_item_item1' }),
        requestError({
          key: 'update_survey_item_item1',
          error: { statusCode: 404, message: 'oops' },
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('creates a response -- SUCCESS', (done) => {
    const dto: any = {
      responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
      freeResponse: 'resp1'
    };

    const resp = { ...dto };

    nockScope.post('/surveys/survey1/items/item1/responses')
      .reply(200, resp);

    const action$ = of(slice.createResponse({ dto, surveyItemId: 'item1', surveyId: 'survey1' }));

    epics.createResponseEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_response_item_item1' }),
        requestSuccess({ key: 'create_response_item_item1' }),
        slice.receiveOwnResponses({ surveyResponses: [expect.any(SurveyResponse)] })
      ]);
      done();
    });
  });
  
  it('creates a response -- ERROR', (done) => {
    const dto: any = {
      responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
      freeResponse: 'resp1'
    };

    nockScope.post('/surveys/survey1/items/item1/responses')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.createResponse({ dto, surveyItemId: 'item1', surveyId: 'survey1' }));

    epics.createResponseEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'create_response_item_item1' }),
        requestError({
          key: 'create_response_item_item1',
          error: { statusCode: 404, message: 'oops' },
          shouldToastError: false
        })
      ]);
      done();
    });
  });

  it('deletes own responses for a survey -- SUCCESS', (done) => {
    nockScope.options('/surveys/survey1/own-responses')
      .reply(200);
    nockScope.delete('/surveys/survey1/own-responses')
      .reply(200);

    const action$ = of(slice.deleteOwnResponsesForSurvey({ surveyId: 'survey1' }));

    epics.deleteOwnResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'delete_own_responses_survey_survey1' }),
        requestSuccess({ key: 'delete_own_responses_survey_survey1' }),
        slice.clearOwnResponses(),
        slice.fetchSurveys()
      ]);
      done();
    });
  });
  
  it('deletes own responses for a survey -- ERROR', (done) => {
    nockScope.options('/surveys/survey1/own-responses')
      .reply(200);
    nockScope.delete('/surveys/survey1/own-responses')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.deleteOwnResponsesForSurvey({ surveyId: 'survey1' }));

    epics.deleteOwnResponsesForSurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'delete_own_responses_survey_survey1' }),
        requestError({
          key: 'delete_own_responses_survey_survey1',
          error: undefined as any, // axios doesn't read delete resp body??
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('destroys a survey -- SUCCESS', (done) => {
    nockScope.options('/surveys/survey1')
      .reply(200);
    nockScope.delete('/surveys/survey1')
      .reply(200);

    const action$ = of(slice.destroySurvey({ surveyId: 'survey1' }));

    epics.destroySurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'destroy_survey_survey1' }),
        requestSuccess({ key: 'destroy_survey_survey1' }),
        slice.removeSurvey({ surveyId: 'survey1' })
      ]);
      done();
    });
  });
  
  it('destroys a survey -- ERROR', (done) => {
    nockScope.options('/surveys/survey1')
      .reply(200);
    nockScope.delete('/surveys/survey1')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.destroySurvey({ surveyId: 'survey1' }));

    epics.destroySurveyEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'destroy_survey_survey1' }),
        requestError({
          key: 'destroy_survey_survey1',
          error: undefined as any,
          shouldToastError: true
        })
      ]);
      done();
    });
  });

  it('destroys a survey item -- SUCCESS', (done) => {
    nockScope.options('/surveys/survey1/items/item1')
      .reply(200);
    nockScope.delete('/surveys/survey1/items/item1')
      .reply(200);

    const action$ = of(slice.destroySurveyItem({ surveyId: 'survey1', surveyItemId: 'item1' }));

    epics.destroySurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'destroy_survey_item_item1' }),
        requestSuccess({ key: 'destroy_survey_item_item1' }),
        slice.removeSurveyItem({ surveyId: 'survey1', surveyItemId: 'item1' })
      ]);
      done();
    });
  });
  
  it('destroys a survey item -- ERROR', (done) => {
    nockScope.options('/surveys/survey1/items/item1')
      .reply(200);
    nockScope.delete('/surveys/survey1/items/item1')
      .reply(404, { statusCode: 404, message: 'oops' });

    const action$ = of(slice.destroySurveyItem({ surveyId: 'survey1', surveyItemId: 'item1' }));

    epics.destroySurveyItemEpic(action$, state$).pipe(
      toArray()
    ).subscribe((dispatchedActions: AnyAction[]) => {
      expect(dispatchedActions).toEqual([
        requestStart({ key: 'destroy_survey_item_item1' }),
        requestError({
          key: 'destroy_survey_item_item1',
          error: undefined as any,
          shouldToastError: true
        })
      ]);
      done();
    });
  });
});