import { FormProvider } from "react-hook-form";
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { customRender, CustomRenderResult, debug, FormContextConsumerWrapper, query } from "../../../test-utils";
import { ContentInterludeFields } from "./ContentInterludeFields";

describe('ContentInterludeFields', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;
  let originalConsoleWarn = console.warn;

  beforeEach(() => {
    // suppressing react-hook-form package's own warnings in test output :/
    console.warn = jest.fn();
    initialState = {
      surveys: {
        surveyItems: {
          item1: { uuid: 'item1', itemType: SurveyItemType.CONTENT_INTERLUDE, content: '<p>content1</p>'}
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}}>
        <ContentInterludeFields surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    )
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('renders a content field with no error message', () => {
    defaultRender();
    const label = () => query('label[for=content]');
    const rte = () => query('.rich-text-editor');
    const error = () => query('.text-danger');

    expect(label()).toBeInTheDocument();
    expect(label()).toHaveTextContent('Content');

    expect(rte()).toBeInTheDocument();
    expect(rte()).toHaveTextContent('content1');

    expect(error()).toBeInTheDocument();
    expect(error()).toHaveTextContent('');

  });

  it('shows a field error message if there is one', () => {
    customRender(
      <FormContextConsumerWrapper errors={{ content: 'bad' }}>
        <ContentInterludeFields surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    );

    const error = () => query('.text-danger');

    expect(error()).toHaveTextContent('bad');
  });
});