import { SurveyResponse, SurveyResponseType } from "./survey-response.model";

describe('SurveyResponse', () => {
  it('constructs from an object', () => {
    const json = {
      selection: 'a',
      selections: ['a', 'b'],
      freeResponse: 'resp1',
      survey: 'survey1',
      surveyItem: 'item1',
      responseType: SurveyResponseType.FREE_RESPONSE_RESPONSE,
      user: 'user1',
      uuid: 'uuid1',
      createdAt: new Date()
    };

    const resp = new SurveyResponse(json);

    expect(resp.selection).toBe(json.selection);
    expect(resp.selections).toEqual(json.selections);
    expect(resp.freeResponse).toBe(json.freeResponse);
    expect(resp.survey).toBe(json.survey);
    expect(resp.surveyItem).toBe(json.surveyItem);
    expect(resp.responseType).toBe(json.responseType);
    expect(resp.user).toBe(json.user);
    expect(resp.uuid).toBe(json.uuid);
    expect(resp.createdAt).toEqual(json.createdAt);
  });
});