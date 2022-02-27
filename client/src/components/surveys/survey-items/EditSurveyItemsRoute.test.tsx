import { act } from "@testing-library/react";
import { ModalKeys } from "../../../constants/ModalKeys.enum";
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { SurveyItemTypeData } from "../../../constants/SurveyItemTypeData";
import { setModalData, setModalOpen } from "../../../store/modals/slice";
import { click, customRender, debug, query, queryAll, testUser, wait } from "../../../test-utils";
import { EditSurveyItemsRoute } from "./EditSurveyItemsRoute";

describe('EditSurveyItemsRoute', () => {
  let initialState: any;
  let defaultRender: () => any;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            author: testUser.uuid,
            title: 'title1',
            description: '<p class="inner-description-html">desc1</p>'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <EditSurveyItemsRoute surveyId='survey1' />,
      initialState
    );
  });

  it('renders a container that fades in', () => {
    defaultRender();

    const container = () => query('.edit-survey-items-route');

    expect(container()).toBeInTheDocument();
    expect(container()).toHaveClass('animate__animated');
    expect(container()).toHaveClass('animate__fadeIn');
  });

  it('renders a link back to the surveys list route', () => {
    defaultRender();

    const link = () => query('.surveys-link');

    expect(link()).toBeInTheDocument();
    expect(link()?.tagName).toBe('A');
    expect(link()).toHaveAttribute('href', '/surveys');

    expect(link()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'arrow-left');
    expect(link()).toHaveTextContent('Back to surveys list');
  });

  it('renders a header card with survey title and description, plus edit button', () => {
    defaultRender();

    const header = () => query('.edit-survey-items-header');

    expect(header()).toHaveClass('card');
    expect(header()?.querySelector('h2 span')).toHaveClass('sr-only');
    expect(header()?.querySelector('h2 span')).toHaveTextContent('Edit survey');
    expect(header()?.querySelector('h2')).toHaveTextContent('Edit survey title1');

    expect(query('.description > span')).toHaveClass('sr-only');
    expect(query('.description > span')).toHaveTextContent('Survey Description:');
    expect(query('.description .inner-description-html')).toBeInTheDocument();
    expect(query('.description .inner-description-html')).toHaveTextContent('desc1');

    expect(header()?.querySelector('.edit-title-btn .mock-fa-icon')).toHaveAttribute('data-icon', 'pencil-alt')
    expect(header()?.querySelector('.edit-title-btn')).toHaveTextContent('Edit title & description');
  });

  it('handles an edit-title click and opens the edit modal', () => {
    const { mockStore } = defaultRender();

    const button = () => query('.edit-title-btn');

    expect(mockStore.dispatch).not.toHaveBeenCalled();

    click(button());

    expect(mockStore.dispatch).toHaveBeenCalledWith(setModalData({ key: ModalKeys.SURVEY_GENERAL, data: { surveyId: 'survey1' }}));
    expect(mockStore.dispatch).toHaveBeenCalledWith(setModalOpen({ key: ModalKeys.SURVEY_GENERAL, open: true }));
  });

  it('displays the items list', () => {
    defaultRender();

    expect(query('.survey-items-list')).toBeInTheDocument();
  });

  it('has a button with dropdown for adding new items', async () => {
    defaultRender();

    const container = () => query('.add-item-container');
    const button = () => container()?.querySelector('.dropdown-toggle');
    const dropdownMenu = () => container()?.querySelector('.dropdown-menu.show');

    expect(container()).toBeInTheDocument();
    expect(dropdownMenu()).not.toBeInTheDocument();
    expect(button()?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'plus-circle');
    expect(button()).toHaveTextContent('Add item to survey');

    await act(async () => {
      click(button() as Element);
      // otherwise bootstrap opening the dropdown menu throws a 'not wrapped in act()' warning
      await wait(1000);
    });

    expect(dropdownMenu()).toBeInTheDocument();

    const dropdownItems = () => queryAll('.dropdown-item');

    expect(dropdownItems()).toHaveLength(4);

    expect(dropdownItems()[0].querySelector('.mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].icon.iconName);
    expect(dropdownItems()[0])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].label);
    expect(dropdownItems()[0])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].description);
    
    expect(dropdownItems()[1].querySelector('.mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.FREE_RESPONSE].icon.iconName);
    expect(dropdownItems()[1])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.FREE_RESPONSE].label);
    expect(dropdownItems()[1])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.FREE_RESPONSE].description);
    
    expect(dropdownItems()[2].querySelector('.mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.MULTIPLE_CHOICE].icon.iconName);
    expect(dropdownItems()[2])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.MULTIPLE_CHOICE].label);
    expect(dropdownItems()[2])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.MULTIPLE_CHOICE].description);
    
    expect(dropdownItems()[3].querySelector('.mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.MULTIPLE_SELECT].icon.iconName);
    expect(dropdownItems()[3])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.MULTIPLE_SELECT].label);
    expect(dropdownItems()[3])
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.MULTIPLE_SELECT].description);
  });

});