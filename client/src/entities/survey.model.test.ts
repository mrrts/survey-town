import { Survey } from "./survey.model";

describe('Survey', () => {
  it('constructs from an object', () => {
    const json = {
      author: 'user1',
      title: 'title1',
      description: 'desc1',
      responsesPublic: true,
      uuid: 'uuid1',
      createdAt: new Date(),
      updatedAt: new Date(),
      surveyItems: ['item1', 'item2'],
      numberOfResponses: 4
    };

    const survey = new Survey(json);

    expect(survey.author).toBe(json.author);
    expect(survey.title).toBe(json.title);
    expect(survey.description).toBe(json.description);
    expect(survey.responsesPublic).toBe(json.responsesPublic);
    expect(survey.uuid).toBe(json.uuid);
    expect(survey.createdAt).toEqual(json.createdAt);
    expect(survey.updatedAt).toEqual(json.updatedAt);
    expect(survey.surveyItems).toEqual(json.surveyItems);
    expect(survey.numberOfResponses).toBe(json.numberOfResponses);
  });
});