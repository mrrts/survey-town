import { MultipleSelectResults } from "./MultipleSelectResults";
import { customRender, queryAll } from '../../../test-utils';
import { RenderResult } from "@testing-library/react";
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { SurveyResponseType } from "../../../entities/survey-response.model";

describe('MultipleSelectResults', () => {
  let initialState: any;
  let defaultRender: () => RenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: { itemType: SurveyItemType.MULTIPLE_SELECT, uuid: 'item1', choices: ['a', 'b', 'c'] }
        },
        anonSurveyResponses: {
          resp1: { responseType: SurveyResponseType.MULTIPLE_SELECT_RESPONSE, selections: ['a', 'b'], surveyItem: 'item1' },
          resp2: { responseType: SurveyResponseType.MULTIPLE_SELECT_RESPONSE, selections: ['a', 'c'], surveyItem: 'item1' },
          resp3: { responseType: SurveyResponseType.MULTIPLE_SELECT_RESPONSE, selections: ['a', 'b', 'c'], surveyItem: 'item1' },
          resp4: { responseType: SurveyResponseType.MULTIPLE_SELECT_RESPONSE, selections: ['a', 'c'], surveyItem: 'item1' },
        }
      }
    };

    defaultRender = () => customRender(
      <MultipleSelectResults surveyItemId='item1' />,
      initialState
    );
  });

  it('shows the surveyItem choices and their respective percentage bars', () => {
    defaultRender();

    const choices = queryAll('.choice-container');

    expect(choices).toHaveLength(3);

    expect(choices[0].querySelector('.choice-text')).toHaveTextContent('a');
    expect(choices[1].querySelector('.choice-text')).toHaveTextContent('b');
    expect(choices[2].querySelector('.choice-text')).toHaveTextContent('c');
    
    expect(choices[0].querySelector('.progress-bar')).toHaveAttribute('aria-valuenow', '100');
    expect(choices[1].querySelector('.progress-bar')).toHaveAttribute('aria-valuenow', '50');
    expect(choices[2].querySelector('.progress-bar')).toHaveAttribute('aria-valuenow', '75');
  });
});