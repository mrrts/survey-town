import { query, queryAll, customRender, debug, FormContextConsumerWrapper } from '../../../test-utils';
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { TakeMultipleSelect } from "./TakeMultipleSelect";

describe('TakeMultipleSelect', () => {
  let initialState: any;
  let defaultRender: () => any;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            prompt: '<p class="prompt-text">prompt1?</p>',
            itemType: SurveyItemType.MULTIPLE_SELECT,
            choices: ['a', 'b', 'c']
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeMultipleSelect surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    );
  });

  it('shows a spinner when the survey item isn\'t truthy', () => {
    customRender(
      <FormContextConsumerWrapper errors={{}}>
        <TakeMultipleSelect surveyItemId="item2" />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(query('.take-multiple-select-container')).not.toBeInTheDocument();
    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });

  it('shows a container that fades in', () => {
    defaultRender();

    const container = () => query('.take-multiple-select-container');

    expect(container()).toBeInTheDocument();
    expect(container()).toHaveClass('animate__animated', 'animate__fadeIn');
  });

  it('renders the prompt HTML', () => {
    defaultRender();

    expect(query('.prompt')).toBeInTheDocument();
    expect(query('.prompt p.prompt-text')).toBeInTheDocument();
    expect(query('.prompt p.prompt-text')).toHaveTextContent('prompt1?');
  });

  it('has a field of check boxes representing the item choices', () => {
    defaultRender();

    const label = () => query('label[for=selections]');
    const checkboxes = () => queryAll('.form-check');

    expect(label()).toHaveClass('sr-only');
    expect(label()).toHaveTextContent('Make your selection');

    expect(checkboxes()).toHaveLength(3);
    expect(checkboxes()[0].querySelector('.form-check-input')).toHaveAttribute('type', 'checkbox');
    expect(checkboxes()[0].querySelector('.form-check-label')).toHaveTextContent('a');
    expect(checkboxes()[1].querySelector('.form-check-input')).toHaveAttribute('type', 'checkbox');
    expect(checkboxes()[1].querySelector('.form-check-label')).toHaveTextContent('b');
    expect(checkboxes()[2].querySelector('.form-check-input')).toHaveAttribute('type', 'checkbox');
    expect(checkboxes()[2].querySelector('.form-check-label')).toHaveTextContent('c');
  });

  it('shows an error message if there is a field error', () => {
    customRender(
      <FormContextConsumerWrapper errors={{ selections: 'bad' }}>
        <TakeMultipleSelect surveyItemId="item1" />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(query('.text-danger')).toHaveTextContent('bad');
  });
});