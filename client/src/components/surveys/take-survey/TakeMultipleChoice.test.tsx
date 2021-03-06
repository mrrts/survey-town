import { TakeMultipleChoice } from "./TakeMultipleChoice";
import { query, queryAll, customRender, debug, FormContextConsumerWrapper, CustomRenderResult } from '../../../test-utils';
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";

describe('TakeMultipleChoice', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            prompt: '<p class="prompt-text">prompt1?</p>',
            itemType: SurveyItemType.MULTIPLE_CHOICE,
            choices: ['a', 'b', 'c']
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeMultipleChoice surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    );
  });

  it('shows a spinner when the survey item isn\'t truthy', () => {
    customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeMultipleChoice surveyItemId="item2" />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(query('.take-multiple-choice-container')).not.toBeInTheDocument();
    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });

  it('shows a container that fades in', () => {
    defaultRender();

    const container = () => query('.take-multiple-choice-container');

    expect(container()).toBeInTheDocument();
    expect(container()).toHaveClass('animate__animated', 'animate__fadeIn');
  });

  it('renders the prompt HTML', () => {
    defaultRender();

    expect(query('.prompt')).toBeInTheDocument();
    expect(query('.prompt p.prompt-text')).toBeInTheDocument();
    expect(query('.prompt p.prompt-text')).toHaveTextContent('prompt1?');
  });

  it('has a field of radio buttons representing the item choices', () => {
    defaultRender();

    const label = () => query('label[for=selection]');
    const radios = () => queryAll('.form-check');

    expect(label()).toHaveClass('sr-only');
    expect(label()).toHaveTextContent('Make your selection');

    expect(radios()).toHaveLength(3);
    expect(radios()[0].querySelector('.form-check-input')).toHaveAttribute('type', 'radio');
    expect(radios()[0].querySelector('.form-check-label')).toHaveTextContent('a');
    expect(radios()[1].querySelector('.form-check-input')).toHaveAttribute('type', 'radio');
    expect(radios()[1].querySelector('.form-check-label')).toHaveTextContent('b');
    expect(radios()[2].querySelector('.form-check-input')).toHaveAttribute('type', 'radio');
    expect(radios()[2].querySelector('.form-check-label')).toHaveTextContent('c');
  });

  it('shows an error message if there is a field error', () => {
    customRender(
      <FormContextConsumerWrapper errors={{ selection: 'bad' }}>
        <TakeMultipleChoice surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(query('.text-danger')).toHaveTextContent('bad');
  });
});