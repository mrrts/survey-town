import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { customRender, debug, FormContextConsumerWrapper, query } from "../../../test-utils";
import { TakeFreeResponse } from "./TakeFreeResponse";

describe('TakeFreeResponse', () => {
  let initialState: any;
  let defaultRender: () => any;
  let originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = jest.fn() // supress react-hook-form src's warnings in test output
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.FREE_RESPONSE,
            prompt: '<p class="prompt-content">prompt1?</p>'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeFreeResponse surveyItemId='item1' />
      </FormContextConsumerWrapper>,
      initialState
    );
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('shows a spinner if the survey item is not found', () => {
    customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeFreeResponse surveyItemId='item2' />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(query('.take-free-response-container')).not.toBeInTheDocument();
    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });

  it('shows a container that fades in', () => {
    defaultRender();

    const container = () => query('.take-free-response-container');

    expect(container()).toBeInTheDocument();
    expect(container()).toHaveClass('animate__animated', 'animate__fadeIn');
  });

  it('has a container that displays the prompt', () => {
    defaultRender();

    expect(query('.prompt')).toBeInTheDocument();
    expect(query('.prompt p.prompt-content')).toHaveTextContent('prompt1?');
  });

  it('has a rich text editor field for the user\'s response', () => {
    defaultRender();

    const label = () => query('label[for=freeResponse]');

    expect(label()).toBeInTheDocument();
    expect(label()).toHaveClass('sr-only');
    expect(label()).toHaveTextContent('Your Response');

    expect(label()?.nextElementSibling).toHaveClass('rich-text-editor');
  });

  it('displays a field error', () => {
    customRender(
      <FormContextConsumerWrapper errors={{ freeResponse: 'bad' }}>
        <TakeFreeResponse surveyItemId='item1' />
      </FormContextConsumerWrapper>,
      initialState
    );

    const error = () => query('.text-danger');

    expect(error()).toHaveTextContent('bad');
  });
});