import { RenderResult } from "@testing-library/react";
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { customRender, debug, query, queryAll } from "../../../test-utils";
import { FreeResponseResults } from "./FreeResponseResults";

describe('FreeResponseResults', () => {
  let initialState: any;
  let defaultRender: () => RenderResult;
  const container = () => query('.free-response-results');
  const list = () => query('.free-response-results ul');
  const listItems = () => queryAll('.free-response-results ul > li');

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: { itemType: SurveyItemType.FREE_RESPONSE }
        },
        anonSurveyResponses: {
          resp1: { uuid: 'resp1', freeResponse: 'freeResponse1', surveyItem: 'item1' },
          resp2: { uuid: 'resp2', freeResponse: 'freeResponse2', surveyItem: 'item1' },
          resp3: { uuid: 'resp3', freeResponse: 'freeResponse3', surveyItem: 'item2' },
        }
      }
    };

    defaultRender = () => customRender(
      <FreeResponseResults surveyItemId={'item1'} />,
      initialState
    );
  });

  it('renders a list of responses', () => {
    defaultRender();

    expect(container()).toBeInTheDocument();
    expect(list()).toBeInTheDocument();
    expect(listItems()).toHaveLength(2);

    expect(listItems()[0]).toHaveTextContent('freeResponse1');
    expect(listItems()[1]).toHaveTextContent('freeResponse2');
  });
});