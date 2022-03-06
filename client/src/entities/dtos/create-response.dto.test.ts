import { SurveyResponseType } from "../survey-response.model";
import { CreateResponseDto } from "./create-response.dto";

describe('CreateResponseDto', () => {

  it('constructs from an object', () => {
    const json = {
      responseType: SurveyResponseType.MULTIPLE_CHOICE_RESPONSE,
      selection: 'a',
      selections: ['a', 'b'],
      freeResponse: 'resp1'
    };

    const dto = new CreateResponseDto(json);

    expect(dto.responseType).toBe(SurveyResponseType.MULTIPLE_CHOICE_RESPONSE);
    expect(dto.selection).toBe('a');
    expect(dto.selections).toEqual(['a', 'b']);
    expect(dto.freeResponse).toBe('resp1');
  });
});