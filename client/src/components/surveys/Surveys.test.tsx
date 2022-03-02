import { Surveys } from './Surveys';
import { click, customRender, CustomRenderResult, debug, query, queryAll } from '../../test-utils';
import { sub } from 'date-fns';
import { ModalKeys } from '../../constants/ModalKeys.enum';
import { setModalData, setModalOpen } from '../../store/modals/slice';

describe('Surveys', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          third: { uuid: 'third', title: 'survey3', createdAt: sub(new Date(), { years: 1 })},
          first: { uuid: 'first', title: 'survey1', createdAt: sub(new Date(), { years: 3 })},
          second: { uuid: 'second', title: 'survey2', createdAt: sub(new Date(), { years: 2 })},
        }
      },
      modals: {
        modals: {
          [ModalKeys.SURVEY_GENERAL]: { isOpen: false, data: {}}
        }
      }
    };

    defaultRender = () => customRender(
      <Surveys />,
      initialState
    );
  });

  it('renders a container that fades in', () => {
    defaultRender();

    const surveys = () => query('.surveys');

    expect(surveys()).toBeInTheDocument();
    expect(surveys()).toHaveClass('animate__animated', 'animate__fadeIn');
  });

  it('has a header with an h2 title', () => {
    defaultRender();

    const header = () => query('.surveys .surveys-header');

    expect(header()).toBeInTheDocument();
    expect(header()?.querySelector('h2')).toHaveTextContent('Surveys');
  });

  it('has a create-survey button in the header, which opens a modal', () => {
    const { mockStore } = defaultRender();

    const btn = () => query('.surveys-header .actions .create-survey-button');

    expect(btn()).toHaveClass('btn-lg', 'btn-primary');
    expect(btn()).toHaveTextContent('Create a Survey');
    expect(btn()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'plus-circle');

    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalData({ key: ModalKeys.SURVEY_GENERAL, data: {}}));
    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: true }));

    click(btn());

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalData({ key: ModalKeys.SURVEY_GENERAL, data: {}}));
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: true }));
  });

  it('renders a list of surveys in order by most recent first', () => {
    defaultRender();

    const surveyListItems = () => queryAll('.survey-list-item');

    expect(surveyListItems()).toHaveLength(3);
    expect(surveyListItems()[0]?.textContent).toContain('survey3');
    expect(surveyListItems()[1]?.textContent).toContain('survey2');
    expect(surveyListItems()[2]?.textContent).toContain('survey1');
  });
});