import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { customRender, CustomRenderResult, debug, FormContextConsumerWrapper, query } from "../../../test-utils";
import { FreeResponseFields } from "./FreeResponseFields";

describe('FreeResponseFields', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;
  let originalConsoleWarn = console.warn;

  beforeEach(() => {
    // suppress annoying warnings logged by react-hook-form source code
    console.warn = jest.fn();

    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.FREE_RESPONSE,
            prompt: 'prompt1?'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}}>
        <FreeResponseFields surveyItemId='item1' />
      </FormContextConsumerWrapper>
    );
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  })

  it('show a field for the prompt', () => {
    defaultRender();

    const label = () => query('label[for=prompt]');
    const rte = () => query('.rich-text-editor');
    
    expect(label()).toBeInTheDocument();
    expect(label()).toHaveTextContent('Question / Prompt');

    expect(label()?.nextElementSibling).toBe(rte());
  });

  it('shows no errors when there are no errors', () => {
    defaultRender();

    const error = () => query('.text-danger');

    expect(error()).toHaveTextContent('');
  });

  it('shows errors', () => {
    customRender(
      <FormContextConsumerWrapper errors={{ prompt: 'bad' }}>
        <FreeResponseFields surveyItemId='item1' />
      </FormContextConsumerWrapper>
    );

    const error = () => query('.text-danger');

    expect(error()).toHaveTextContent('bad');
  });
});