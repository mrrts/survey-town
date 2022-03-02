import { ModalKeys } from "../../../constants/ModalKeys.enum";
import { click, customRender, CustomRenderResult, debug, query } from "../../../test-utils";
import { TakeSurveyModal } from "./TakeSurveyModal";
import { setModalData, setModalOpen } from '../../../store/modals/slice';

describe('TakeSurveyModal', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            title: 'title1',
          }
        },
        takingSurveySubmittedItemData: {},
        surveyItems: {}
      },
      modals: {
        modals: {
          [ModalKeys.TAKE_SURVEY]: {
            isOpen: true,
            data: { surveyId: 'survey1' }
          }
        }
      }
    };

    defaultRender = () => customRender(
      <TakeSurveyModal />,
      initialState
    );
  });

  it('renders a modal with the survey title when state is set to show', () => {
    defaultRender();

    expect(query('.modal-backdrop.show')).toBeInTheDocument();
    expect(query('.modal.show')).toBeInTheDocument();
    expect(query('.modal.show')).toHaveAttribute('aria-modal', 'true');
    expect(query('.modal h4')).toHaveTextContent('title1');
  });

  it('renders the take-survey component', () => {
    defaultRender();

    expect(query('.take-survey-container')).toBeInTheDocument();
  });

  it('has a modal footer with a close button', () => {
    defaultRender();

    expect(query('.modal .modal-footer')).toBeInTheDocument();
    expect(query('.modal .modal-footer .btn-secondary.close-modal-button')).toHaveTextContent('Close');
  });

  it('closes the modal when the close button is clicked', () => {
    const { mockStore } = defaultRender();

    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalData({ key: ModalKeys.TAKE_SURVEY, data: {} }));
    expect(mockStore.dispatch)
      .not.toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.TAKE_SURVEY, open: false }));

    const closeBtn = () => query('.close-modal-button');

    click(closeBtn());

    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalData({ key: ModalKeys.TAKE_SURVEY, data: {} }));
    expect(mockStore.dispatch)
      .toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.TAKE_SURVEY, open: false }));
  });
});