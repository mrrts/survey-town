import { SurveyItemType } from "../../constants/SurveyItemType.enum";
import { UpdateSurveyItemDto } from "./update-survey-item.dto";

describe('UpdateSurveyItemDto', () => {
  it('constructs from an object', () => {
    const json = {
      itemType: SurveyItemType.CONTENT_INTERLUDE,
      content: 'content1',
      prompt: 'prompt1',
      choices: ['a', 'b']
    };

    const dto = new UpdateSurveyItemDto(json);

    expect(dto.itemType).toBe(SurveyItemType.CONTENT_INTERLUDE);
    expect(dto.content).toBe('content1');
    expect(dto.prompt).toBe('prompt1');
    expect(dto.choices).toEqual(['a', 'b']);
  });
});