import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { SurveyItemTypeData } from "../../../constants/SurveyItemTypeData";
import { customRender, query, queryAll } from "../../../test-utils";
import { ItemsList } from "./ItemsList";

describe('ItemsList', () => {
  let initialState: any;
  let defaultRender: () => any;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    console.warn = jest.fn() // suppress react-hook-form src warnings in test console
    initialState = {
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            surveyItems: ['item1', 'item2']
          }
        },
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.CONTENT_INTERLUDE
          },
          item2: {
            uuid: 'item2',
            itemType: SurveyItemType.FREE_RESPONSE
          }
        }
      }
    };

    defaultRender = () => customRender(
      <ItemsList surveyId='survey1' />,
      initialState
    );
  });

  afterEach(() => {
    console.warn = originalConsoleWarn;
  });

  it('renders a ul element of survey items', () => {
    defaultRender();

    const list = () => query('.survey-items-list');
    const listItems = () => queryAll('.survey-items-list-item');

    expect(list()).toBeInTheDocument();
    expect(list()?.tagName).toBe('UL');

    expect(listItems()).toHaveLength(2);
    expect(listItems()[0]).toHaveClass('card');
    expect(listItems()[0].tagName).toBe('LI');
    expect(listItems()[0].querySelector('h3.survey-item-header')).toHaveTextContent(
      SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].label
    );
    expect(listItems()[0].querySelector('.survey-item-header .mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].icon.iconName);
    expect(listItems()[0].querySelector('.survey-item-description'))
      .toHaveClass('text-muted');
    expect(listItems()[0].querySelector('.survey-item-description'))
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.CONTENT_INTERLUDE].description);
    expect(listItems()[0].querySelector('.survey-item-form')).toBeInTheDocument();
  });
});