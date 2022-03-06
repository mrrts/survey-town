import { UpdateSurveyDto } from "./update-survey.dto";

describe('UpdateSurveyDto', () => {
  it('constructs from an object', () => {
    const json = {
      title: 'title1',
      description: 'desc1'
    };

    const dto = new UpdateSurveyDto(json);

    expect(dto.title).toBe('title1');
    expect(dto.description).toBe('desc1');
  });
});