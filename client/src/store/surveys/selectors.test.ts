import { AppState } from '..';
import * as selectors from './selectors';
import { sub } from 'date-fns';

describe('survey selectors', () => {
  let state = {
    surveys: {
      surveys: {
        survey3: { uuid: 'survey3', createdAt: sub(new Date(), { years: 3 }) },
        survey1: { uuid: 'survey1', createdAt: sub(new Date(), { years: 10 }), surveyItems: ['item3'] },
        survey2: { uuid: 'survey2', createdAt: sub(new Date(), { years: 5 }), surveyItems: ['item1', 'item2'] }
      },
      surveyItems: {
        item1: { uuid: 'item1' },
        item2: { uuid: 'item2' },
        item3: { uuid: 'item3' }
      },
      ownResponses: {
        resp1: { uuid: 'resp1', user: 'user1', survey: 'survey1' },
        resp2: { uuid: 'resp2', user: 'user1', survey: 'survey2' }
      },
      anonSurveyResponses: {
        resp1: { uuid: 'resp1', surveyItem: 'item3', user: 'user1', survey: 'survey1' },
        resp2: { uuid: 'resp2', surveyItem: 'item2', user: 'user1', survey: 'survey2' },
        resp3: { uuid: 'resp3', surveyItem: 'item3', user: 'user2', survey: 'survey1' },
        resp4: { uuid: 'resp4', surveyItem: 'item3', user: 'user3', survey: 'survey1' }
      },
      currentTakingSurveyItem: 'item2',
      takingSurveySubmittedItemData: {}
    }
  } as any as AppState;

  test('getSurveysState', () => {
    expect(selectors.getSurveysState(state)).toBe(state.surveys);
  });

  test('getSurveysByDateDesc', () => {
    expect(selectors.getSurveysByDateDesc(state)).toEqual([
      state.surveys.surveys.survey3,
      state.surveys.surveys.survey2,
      state.surveys.surveys.survey1,
    ])
  });

  test('getSurveyItems', () => {
    expect(selectors.getSurveyItems(state)).toBe(state.surveys.surveyItems);
  });

  test('getSurveyById', () => {
    expect(selectors.getSurveyById('survey2')(state))
      .toBe(state.surveys.surveys.survey2);
  });

  test('getSurveyItemsBySurveyId', () => {
    expect(selectors.getSurveyItemsBySurveyId('survey2')(state))
      .toEqual([
        state.surveys.surveyItems.item1,
        state.surveys.surveyItems.item2,
      ]);
  });

  test('getSurveyItemById', () => {
    expect(selectors.getSurveyItemById('item2')(state))
      .toBe(state.surveys.surveyItems.item2);
  });

  test('getOwnResponses', () => {
    expect(selectors.getOwnResponses(state)).toBe(state.surveys.ownResponses);
  });

  test('getAnonResponses', () => {
    expect(selectors.getAnonResponses(state)).toBe(state.surveys.anonSurveyResponses);
  });

  test('getOwnResponsesForSurvey', () => {
    expect(selectors.getOwnResponsesForSurvey('survey1')(state)).toEqual([
      state.surveys.ownResponses.resp1
    ]);
  });

  test('getCurrentTakingSurveyItem', () => {
    expect(selectors.getCurrentTakingSurveyItem(state)).toBe('item2');
  });

  test('getTakingSubmittedItemData', () => {
    expect(selectors.getTakingSurveySubmittedItemData(state))
      .toBe(state.surveys.takingSurveySubmittedItemData);
  });

  test('getResponsesForSurveyItem', () => {
    const result = selectors.getResponsesForSurveyItem('item3')(state);
    expect(result).toHaveLength(3);
    expect(result[0].uuid).toBe('resp1');
    expect(result[1].uuid).toBe('resp3');
    expect(result[2].uuid).toBe('resp4');
    
  });
});