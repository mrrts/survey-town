import { SurveyItem, SurveyItemType } from "./survey-item.entity";

describe('SurveyItem entity', () => {
  let data: any;

  beforeEach(() => {
    data = {
      author: 'user123'
    };
  });

  it('assigns the properties passed into it and assigns default generic values', () => {
    const item = new SurveyItem({
      ...data,
    })
    expect(item.author).toBe(data.author);
    expect(item.uuid).toBeTruthy();
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.updatedAt).toBeInstanceOf(Date);
  });

  it('accepts the correct fields for a CONTENT_INTERLUDE item', () => {
    const item = new SurveyItem({
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
      prompt: 'prompt1',
      choices: ['a', 'b']
    });

    expect(item.itemType).toBe(SurveyItemType.CONTENT_INTERLUDE);
    expect(item.content).toBe('content1');
    expect(item.prompt).not.toBeDefined();
    expect(item.choices).not.toBeDefined();
  });

  it('accepts the correct fields for a FREE_RESPONSE item', () => {
    const item = new SurveyItem({
      itemType: SurveyItemType.FREE_RESPONSE,
      content: 'content1',
      prompt: 'prompt1',
      choices: ['a', 'b']
    });

    expect(item.itemType).toBe(SurveyItemType.FREE_RESPONSE);
    expect(item.content).not.toBeDefined;
    expect(item.prompt).toBe('prompt1');
    expect(item.choices).not.toBeDefined();
  });
  
  it('accepts the correct fields for a MULTIPLE_CHOICE item', () => {
    const item = new SurveyItem({
      itemType: SurveyItemType.MULTIPLE_CHOICE,
      content: 'content1',
      prompt: 'prompt1',
      choices: ['a', 'b']
    });

    expect(item.itemType).toBe(SurveyItemType.MULTIPLE_CHOICE);
    expect(item.content).not.toBeDefined;
    expect(item.prompt).toBe('prompt1');
    expect(item.choices).toEqual(['a', 'b']);
  });
  
  it('accepts the correct fields for a MULTIPLE_SELECT item', () => {
    const item = new SurveyItem({
      itemType: SurveyItemType.MULTIPLE_SELECT,
      content: 'content1',
      prompt: 'prompt1',
      choices: ['a', 'b']
    });

    expect(item.itemType).toBe(SurveyItemType.MULTIPLE_SELECT);
    expect(item.content).not.toBeDefined;
    expect(item.prompt).toBe('prompt1');
    expect(item.choices).toEqual(['a', 'b']);
  });
});