import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { destroySurveyItem } from "../../../store/surveys/slice";
import { click, customRender, FormContextConsumerWrapper, query, wait } from "../../../test-utils";
import { SurveyItemForm } from "./SurveyItemForm";


describe('SurveyItemForm', () => {
  let initialState: any;
  let defaultRender: () => any;
  const originalConsoleWarn = console.warn;
  
  const form = () => query('.survey-item-form');
  
  beforeEach(() => {
    jest.useFakeTimers();
    console.warn = jest.fn(); // suppress react-hook-form src's warnings in test console
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.CONTENT_INTERLUDE,
            content: 'content1'
          },
          item2: {
            uuid: 'item2',
            itemType: SurveyItemType.FREE_RESPONSE,
            prompt: 'prompt1'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <FormContextConsumerWrapper errors={{}} overrides={{}}>
        <SurveyItemForm surveyId='survey1' surveyItemId='item1' />
      </FormContextConsumerWrapper>,
      initialState
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    console.warn = originalConsoleWarn;
  });

  it('shows a form', () => {
    defaultRender();
    expect(form()).toBeInTheDocument();
  });

  it('shows the right fields component for the item type - CONTENT_INTERLUDE', () => {
    defaultRender();

    expect(form()?.querySelector('.content-interlude-fields')).toBeInTheDocument();
  });
  
  it('shows the right fields component for the item type - FREE_RESPONSE', () => {
    customRender(
      <SurveyItemForm surveyId='survey1' surveyItemId='item2' />,
      initialState
    );

    expect(form()?.querySelector('.content-interlude-fields')).not.toBeInTheDocument();
    expect(form()?.querySelector('.free-response-fields')).toBeInTheDocument();
  });

  it('has an actions container with action buttons', () => {
    defaultRender();

    const actions = () => query('.survey-item-actions');

    expect(actions()?.querySelector('.delete-item-btn')).toBeInTheDocument();
    expect(actions()?.querySelector('.delete-item-btn .mock-fa-icon'))
      .toHaveAttribute('data-icon', 'trash');
    expect(actions()?.querySelector('.save-item-btn')).toBeInTheDocument();
    expect(actions()?.querySelector('.save-item-btn')).toHaveAttribute('type', 'submit');
    expect(actions()?.querySelector('.save-item-btn .mock-fa-icon'))
      .toHaveAttribute('data-icon', 'check-circle');
  });

  it('deletes a survey item, first requiring a confirmation', () => {
    const { mockStore } = defaultRender();

    const deleteBtn = () => query('.delete-item-btn');

    expect(deleteBtn()).toHaveTextContent('Delete Item');

    click(deleteBtn());

    expect(deleteBtn()).toHaveTextContent('Confirm?');

    click(deleteBtn());

    expect(mockStore.dispatch).toHaveBeenCalledWith(destroySurveyItem({
      surveyId: 'survey1',
      surveyItemId: 'item1'
    }));
  });

});