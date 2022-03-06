import { SurveyItemType } from "../constants/SurveyItemType.enum";
import { SurveyItem } from "./survey-item.model";

describe('SurveyItem', () => {
  it('constructs from an object', () => {
    const json = {
      prompt: 'prompt1',
      content: 'content1',
      choices: ['a', 'b'],
      author: 'user1',
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      uuid: 'uuid1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const surveyItem = new SurveyItem(json);

    expect(surveyItem.prompt).toBe(json.prompt);
    expect(surveyItem.content).toBe(json.content);
    expect(surveyItem.choices).toEqual(json.choices);
    expect(surveyItem.author).toBe(json.author);
    expect(surveyItem.itemType).toBe(json.itemType);
    expect(surveyItem.uuid).toBe(json.uuid);
    expect(surveyItem.createdAt).toEqual(json.createdAt);
    expect(surveyItem.updatedAt).toEqual(json.updatedAt);
  });
});