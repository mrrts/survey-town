import { SurveyGeneralFormModal } from "./SurveyGeneralFormModal";
import { customRender, CustomRenderResult, query, wait } from "../../test-utils";
import { ModalKeys } from "../../constants/ModalKeys.enum";
import { fireEvent } from "@testing-library/react";
import { createSurvey } from "../../store/surveys/slice";
import { setModalOpen } from "../../store/modals/slice";

describe('SurveyGeneralFormModal', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = jest.fn(); // suppress react-hook-form's deprecation warnings in test console

    initialState = {
      modals: {
        modals: {
          [ModalKeys.SURVEY_GENERAL]: {
            isOpen: true,
            data: { surveyId: null }
          }
        }
      },
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            title: 'title1',
            description: 'desc1'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <SurveyGeneralFormModal />,
      initialState
    );
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('renders a modal with a create-survey title', () => {
    defaultRender();

    const modal = () => query('.modal');

    expect(modal()).toHaveClass('show');
    expect(modal()?.querySelector('.modal-title')).toHaveTextContent('New Survey');
  });

  it('shows form fields for title and description', () => {
    defaultRender();

    expect(query('label[for=title]')).toHaveTextContent('Title*')
    expect(query('input[name=title]')).toHaveAttribute('type', 'text')

    expect(query('label[for=description]')).toHaveTextContent('Description');
    expect(query('label[for=description]')?.nextElementSibling)
      .toBe(query('.rich-text-editor'));
  });

  it('requires a title', async () => {
    const { mockStore } = defaultRender();

    const titleInput = () => query('input[name=title]')

    expect(titleInput()).toBeInTheDocument();
    expect((titleInput() as HTMLInputElement).value).toBe('');

    fireEvent.submit(query('form') as HTMLFormElement);

    await wait(100);

    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(createSurvey(expect.anything()));
    
    expect(titleInput()?.nextElementSibling).toHaveClass('text-danger');
    expect(titleInput()?.nextElementSibling)
      .toHaveTextContent('title is a required field');

    fireEvent.change(titleInput() as Element, { target: { value: 'Title1' } });

    await wait(100);

    expect(titleInput()?.nextElementSibling).toHaveClass('text-danger');
    expect(titleInput()?.nextElementSibling)
      .not.toHaveTextContent('title is a required field');

    fireEvent.submit(query('form') as HTMLFormElement);
    
    await wait(100);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(createSurvey({ dto: { title: 'Title1', description: undefined as any }}));
  });

  it('renders a different title when updating and preloads values', () => {
    initialState.modals.modals[ModalKeys.SURVEY_GENERAL].data = { surveyId: 'survey1' };
  
    customRender(
      <SurveyGeneralFormModal />,
      initialState
    );

    const modalHeader = () => query('.modal-header');

    expect(modalHeader()).toHaveTextContent('Edit Survey');

    const titleInput = () => query('input[name=title]') as HTMLInputElement;

    expect(titleInput().value).toBe('title1');
  });

  it('closes the modal when the close button is clicked', () => {
    const { mockStore } = defaultRender();

    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: false }));

    const closeBtn = () => query('.close-button');

    expect(closeBtn()).toHaveTextContent('Close');

    fireEvent.click(closeBtn() as HTMLButtonElement);

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: false }))
  });

});

