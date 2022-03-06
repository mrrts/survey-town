import { CreateSurveyDto } from "./create-survey.dto";

describe('CreateSurveyDto', () => {
  it('constructs from an object', () => {
    const json = {
      title: 'title1',
      description: 'desc1'
    };

    const dto = new CreateSurveyDto(json);

    expect(dto.title).toBe('title1');
    expect(dto.description).toBe('desc1');
  });
});