import { SurveyListItem } from "./SurveyListItem";
import { click, customRender, CustomRenderResult, query } from "../../test-utils";
import { sub } from 'date-fns';
import { getUser } from "../../store/auth/selectors";
import { destroySurvey } from "../../store/surveys/slice";
import { setModalOpen } from "../../store/modals/slice";
import { ModalKeys } from "../../constants/ModalKeys.enum";

describe('SurveyListItem', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            title: 'title1',
            description: '<p class="mock-description">desc1</p>',
            numberOfResponses: 3,
            createdAt: sub(new Date(), { years: 2 }),
            author: 'user1'
          }
        }
      },
      users: {
        handles: {
          'user1': { handle: 'Handle_1' }
        }
      }
    };

    defaultRender = () => customRender(
      <SurveyListItem surveyId='survey1' />,
      initialState
    )
  });

  it('renders a card for the survey', () => {
    defaultRender();

    const card = () => query('.survey-list-item .survey-card');

    expect(card()).toBeInTheDocument();
    expect(card()).toHaveClass('card');
  });

  it('has a title with a number-of-responses badge', () => {
    defaultRender();

    const title = () => query('.survey-list-item-title');

    expect(title()?.textContent).toContain('title1');
    expect(title()?.querySelector('.sr-only')).toHaveTextContent('Survey Title');

    const badge = () => query('.survey-list-item-title .responses-badge');

    expect(badge()).toBeInTheDocument();

    expect(badge()).toHaveTextContent('3 responses');
  });

  it('correctly de-pluralizes when there is only one response', () => {
    initialState.surveys.surveys.survey1.numberOfResponses = 1;

    customRender(
      <SurveyListItem surveyId="survey1" />,
      initialState
    );

    const badge = () => query('.survey-list-item-title .responses-badge');

    expect(badge()).toHaveTextContent('1 response');
    expect(badge()).not.toHaveTextContent('1 responses');
  });

  it('contains the authored info - user and relative time', () => {
    defaultRender();

    const subtitle = () => query('.authored-by');

    expect(subtitle()).toBeInTheDocument();
    expect(subtitle()).toHaveClass('text-muted');
    expect(subtitle()).toHaveTextContent('by Handle_1, about 2 years ago')
  });

  it('renders the description html', () => {
    defaultRender();

    const desc = () => query('.description');
    const descContent = () => query('.mock-description')
    expect(desc()).toBeInTheDocument();
    expect(desc()).toContainElement(descContent() as HTMLElement);
    expect(descContent()).toHaveTextContent('desc1');
  });

  it('has an edit-survey button for the owner', () => {
    const { mockStore, history } = defaultRender();

    // is owner ✅
    expect(getUser(mockStore.getState())?.uuid).toBe('user1');
    expect(initialState.surveys.surveys.survey1.author).toBe('user1');

    const editButton = () => query('.edit-survey-general-button');

    expect(editButton()).toBeInTheDocument();
    expect(editButton()?.tagName).toBe('A');
    expect(editButton()).toHaveAttribute('href', '/surveys/survey1/edit');
    expect(editButton()).toHaveClass('btn-link');
    expect(editButton()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'pencil-alt');
    expect(editButton()).toHaveTextContent('Edit Survey');
    
    expect(history.location.pathname).not.toBe('/surveys/survey1/edit');

    click(editButton());

    expect(history.location.pathname).toBe('/surveys/survey1/edit');
  });

  it('has a delete button for the owner', () => {
    const { mockStore } = defaultRender();

    // is owner ✅
    expect(getUser(mockStore.getState())?.uuid).toBe('user1');
    expect(initialState.surveys.surveys.survey1.author).toBe('user1');

    const deleteBtn = () => query('.delete-survey-button');
    expect(deleteBtn()).toBeInTheDocument();
    expect(deleteBtn()).toHaveTextContent('Delete')
    expect(deleteBtn()).toHaveClass('btn-link')
    expect(deleteBtn()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'trash');
  });

  it('doesn\'t show edit and delete button if not owner', () => {
    initialState.surveys.surveys.survey1.author = 'someone_else';

    customRender(
      <SurveyListItem surveyId='survey1' />,
      initialState
    );

    const editButton = () => query('.edit-survey-general-button');
    const deleteBtn = () => query('.delete-survey-button');

    expect(editButton()).not.toBeInTheDocument();
    expect(deleteBtn()).not.toBeInTheDocument();
  });

  it('confirms deletion and deletes', () => {
    const { mockStore } = defaultRender();
    const deleteBtn = () => query('.delete-survey-button');

    expect(deleteBtn()).toHaveTextContent('Delete');
    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(destroySurvey({ surveyId: 'survey1' }));

    click(deleteBtn());

    expect(deleteBtn()).toHaveTextContent('Confirm?');
    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(destroySurvey({ surveyId: 'survey1' }));

    click(deleteBtn());
    
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(destroySurvey({ surveyId: 'survey1' }));
  });

  it('has a take-survey button that opens the modal', () => {
    const { mockStore } = defaultRender();

    const takeSurveyBtn = () => query('.take-survey-button');

    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.TAKE_SURVEY, open: true }));

    expect(takeSurveyBtn()).toHaveTextContent('Take this survey');
    expect(takeSurveyBtn()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'arrow-circle-right');
    expect(takeSurveyBtn()).toHaveClass('btn-primary');

    click(takeSurveyBtn());

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.TAKE_SURVEY, open: true }));
  });
});