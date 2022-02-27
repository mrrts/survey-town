import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { click, customRender, debug, FormContextConsumerWrapper, query, queryAll, wait } from "../../../test-utils";
import { ItemWithChoicesFields } from "./ItemWithChoicesFields";

describe('ItemWithChoicesFields', () => {
  let initialState: any;
  let defaultRender: () => any;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    // suppress in test console the warnings from react-hook-form's src code
    console.warn = jest.fn();

    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.MULTIPLE_CHOICE,
            prompt: 'prompt1?',
            choices: ['a', 'b']
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}} overrides={{}}>
        <ItemWithChoicesFields surveyItemId='item1' />
      </FormContextConsumerWrapper>,
      initialState
    );
  })

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('has a field for the item prompt', () => {
    defaultRender();

    const label = () => query('label[for=prompt]');
    const rte = () => query('.rich-text-editor');

    expect(label()).toBeInTheDocument();
    expect(label()).toHaveTextContent('Question / Prompt');
    expect(label()?.nextElementSibling).toBe(rte());
    expect(rte()).toHaveTextContent('prompt1?');
  });

  it('resets the "choices" field upon mounting', () => {
    const reset = jest.fn();

    expect(reset).not.toHaveBeenCalled();

    customRender(
      <FormContextConsumerWrapper errors={{}} overrides={{ reset }}>
        <ItemWithChoicesFields surveyItemId='item1' />
      </FormContextConsumerWrapper>,
      initialState
    );

    expect(reset).toHaveBeenCalledWith({ choices: ['a', 'b'] });
  });

  it('has a field for each of the existing choices', () => {
    defaultRender();

    const label = () => query('label[for=choices]');
    const choices = () => queryAll('.choice-container');

    expect(label()).toBeInTheDocument();
    expect(label()).toHaveTextContent('Choices');

    expect(choices()).toHaveLength(2);

    const firstChoiceDeleteButton = () => choices()[0]?.querySelector('.delete-choice-button');

    expect(firstChoiceDeleteButton()).toHaveAttribute('aria-label', 'delete choice 1');
    expect(firstChoiceDeleteButton()?.querySelector('.mock-fa-icon'))
      .toHaveAttribute('data-icon', 'times');

    const firstChoiceInput = () => choices()[0]?.querySelector('input.form-control');
    
    expect(firstChoiceInput()).toHaveAttribute('name', 'choices[0]');
    expect(firstChoiceInput()).toHaveAttribute('placeholder', 'Choice 1');
    expect(firstChoiceInput()).toHaveAttribute('value', 'a');
  });

  it('adds a choice', async () => {
    defaultRender();

    const choices = () => queryAll('.choice-container');

    expect(choices()).toHaveLength(2);

    const addChoiceBtn = () => query('.add-choice-container button');

    expect(addChoiceBtn()).toBeInTheDocument();
    expect(addChoiceBtn()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'plus');

    click(addChoiceBtn());

    await wait(1000);

    expect(choices()).toHaveLength(3);

    expect(choices()[2].querySelector('input')).toHaveAttribute('placeholder', 'Choice 3')
  });
});