import { SurveyResponseType } from '../../entities/survey-response.model';
import {
  surveysReducer,
  receiveSurveys,
  receiveSurveyItems,
  receiveSurveyResponses,
  receiveOwnResponses,
  setCurrentTakingSurveyItem,
  setTakingItemData,
  clearAllTakingSurveyData,
  clearOwnResponses,
  clearResponsesForSurvey,
  removeSurvey,
  removeSurveyItem,
  ISurveysState,
  defaultSurveysState,
} from './slice';

describe('surveys reducer', () => {
  let state: ISurveysState;

  beforeEach(() => {
    state = { ...defaultSurveysState };
  });

  test('receiveSurveys', () => {
    state.surveys = {
      survey1: { uuid: 'survey1' } as any
    };

    const newSurveys = [
      { uuid: 'survey2' },
      { uuid: 'survey3' },
    ] as any;

    const action = receiveSurveys({ surveys: newSurveys });

    const newState = surveysReducer(state, action);

    expect(newState.surveys).toEqual({
      survey1: { uuid: 'survey1' },
      survey2: { uuid: 'survey2' },
      survey3: { uuid: 'survey3' },
    })
  });

  test('receiveSurveyItems', () => {
    state.surveyItems = {
      item1: { uuid: 'item1' } as any
    };

    const newItems = [
      { uuid: 'item2' }, 
      { uuid: 'item3' }, 
    ] as any;

    const action = receiveSurveyItems({ surveyItems: newItems });
    
    const newState = surveysReducer(state, action);

    expect(newState.surveyItems).toEqual({
      item1: { uuid: 'item1' },
      item2: { uuid: 'item2' },
      item3: { uuid: 'item3' },
    })
  });

  test('receiveSurveyResponses', () => {
    state.anonSurveyResponses = {
      resp1: { uuid: 'resp1' }
    } as any;

    const newResponses = [
      { uuid: 'resp2' },
      { uuid: 'resp3' },
    ] as any;

    const action = receiveSurveyResponses({ surveyResponses: newResponses });
    const newState = surveysReducer(state, action);

    expect(newState.anonSurveyResponses).toEqual({
      resp1: { uuid: 'resp1' },
      resp2: { uuid: 'resp2' },
      resp3: { uuid: 'resp3' },
    });
  });

  test('receiveOwnResponses', () => {
    state.ownResponses = {
      resp1: { uuid: 'resp1' }
    } as any;

    const newResponses = [
      { uuid: 'resp2' },
      { uuid: 'resp3' },
    ] as any;

    const action = receiveOwnResponses({ surveyResponses: newResponses });
    const newState = surveysReducer(state, action);

    expect(newState.ownResponses).toEqual({
      resp1: { uuid: 'resp1' },
      resp2: { uuid: 'resp2' },
      resp3: { uuid: 'resp3' },
    });
  });

  test('setCurrentTakingSurveyItem', () => {
    expect(state.currentTakingSurveyItem).toBeNull();

    const action = setCurrentTakingSurveyItem({ surveyItemId: 'item1' });
    const newState = surveysReducer(state, action);

    expect(newState.currentTakingSurveyItem).toBe('item1');
  });

  test('setTakingItemData', () => {
    state.takingSurveySubmittedItemData = {
      item1: { surveyItem: 'item1', responseType: SurveyResponseType.MULTIPLE_CHOICE_RESPONSE, selection: 'a' }
    };

    const data = { surveyItem: 'item2', responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE, freeResponse: 'yo' };

    const action = setTakingItemData({ surveyItemId: 'item2', data });
    const newState = surveysReducer(state, action);

    expect(newState.takingSurveySubmittedItemData).toEqual({
      item1: { surveyItem: 'item1', responseType: SurveyResponseType.MULTIPLE_CHOICE_RESPONSE, selection: 'a' },
      item2: data
    })
  });

  test('clearAllTakingSurveyData', () => {
    state.currentTakingSurveyItem = 'item1';
    state.takingSurveySubmittedItemData = {
      item1: { surveyItem: 'item1', responseType: SurveyResponseType.MULTIPLE_CHOICE_RESPONSE, selection: 'a' }
    };

    const action = clearAllTakingSurveyData();
    const newState = surveysReducer(state, action);

    expect(newState.currentTakingSurveyItem).toBe(defaultSurveysState.currentTakingSurveyItem);
    expect(newState.takingSurveySubmittedItemData).toBe(defaultSurveysState.takingSurveySubmittedItemData);
  });

  test('clearOwnResponses', () => {
    state.ownResponses = {
      resp1: { uuid: 'resp1' },
      resp2: { uuid: 'resp2' },
      resp3: { uuid: 'resp3' },
    } as any;

    const action = clearOwnResponses();
    const newState = surveysReducer(state, action);

    expect(newState.ownResponses).toEqual({});
  });

  test('clearResponsesForSurvey', () => {
    state.anonSurveyResponses = {
      resp1: { uuid: 'resp1', survey: 'survey1' },
      resp2: { uuid: 'resp2', survey: 'survey2' },
      resp3: { uuid: 'resp3', survey: 'survey1' },
      resp4: { uuid: 'resp4', survey: 'survey2' },
    } as any;

    const action = clearResponsesForSurvey({ surveyId: 'survey1' });
    const newState = surveysReducer(state, action);

    expect(newState.anonSurveyResponses).toEqual({
      resp2: { uuid: 'resp2', survey: 'survey2' },
      resp4: { uuid: 'resp4', survey: 'survey2' },
    });
  });

  test('removeSurvey', () => {
    state.surveys = {
      survey1: { uuid: 'survey1', title: 'Survey 1' },
      survey2: { uuid: 'survey2', title: 'Survey 2' },
      survey3: { uuid: 'survey3', title: 'Survey 3' },
    } as any;

    const action = removeSurvey({ surveyId: 'survey2' });
    const newState = surveysReducer(state, action);

    expect(newState.surveys).toEqual({
      survey1: { uuid: 'survey1', title: 'Survey 1' },
      survey3: { uuid: 'survey3', title: 'Survey 3' },
    });
  });

  test('removeSurveyItem', () => {
    state.surveys = {
      survey1: { uuid: 'survey1', surveyItems: ['item1', 'item2'] }
    } as any;

    state.surveyItems = {
      item1: { uuid: 'item1' },
      item2: { uuid: 'item2' },
      item3: { uuid: 'item3' },
    } as any;

    const action = removeSurveyItem({ surveyId: 'survey1', surveyItemId: 'item1' });
    const newState = surveysReducer(state, action);

    expect(newState.surveys.survey1.surveyItems).toEqual(['item2']);
    expect(newState.surveyItems).toEqual({
      item2: { uuid: 'item2' },
      item3: { uuid: 'item3' },
    });
  });
});