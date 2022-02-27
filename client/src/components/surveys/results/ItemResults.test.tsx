import { RenderResult } from '@testing-library/react';
import { SurveyItemType } from '../../../constants/SurveyItemType.enum';
import { SurveyItemTypeData } from '../../../constants/SurveyItemTypeData';
import { customRender, query, queryAll } from '../../../test-utils';
import { ItemResults } from './ItemResults';

describe('ItemResults', () => {
  let initialState: any;
  let defaultRender: () => RenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.FREE_RESPONSE,
            prompt: '<p>prompt1?</p>'
          },
          item2: {
            uuid: 'item2',
            itemType: SurveyItemType.CONTENT_INTERLUDE,
            content: '<p>content1</p>'
          },
          item3: {
            uuid: 'item3',
            itemType: SurveyItemType.MULTIPLE_CHOICE,
            prompt: '<p>prompt2?</p>',
            choices: ['a', 'b', 'c']
          },
          item4: {
            uuid: 'item4',
            itemType: SurveyItemType.MULTIPLE_SELECT,
            prompt: '<p>prompt3?</p>',
            choices: ['a', 'b', 'c']
          }
        }
      }
    };

    defaultRender = () => customRender(
      <ItemResults surveyItemId={initialState.surveys.surveyItems.item1.uuid} />,
      initialState
    );
  });

  it('renders nothing if the itemType is CONTENT_INTERLUDE', () => {
    customRender(
      <ItemResults surveyItemId={initialState.surveys.surveyItems.item2.uuid} />,
      initialState
    );

    expect(query('.card.item-results')).not.toBeInTheDocument();
  });

  it('renders a card', () => {
    defaultRender();
    expect(query('.card.item-results')).toBeInTheDocument();
    expect(queryAll('.card.item-results')).toHaveLength(1);
  });

  it('renders a heading with the itemType icon and label', () => {
    defaultRender();
    
    expect(query('.item-results-header h4 .mock-fa-icon'))
      .toHaveAttribute('data-icon', SurveyItemTypeData[SurveyItemType.FREE_RESPONSE].icon.iconName);
    expect(query('.item-results-header h4'))
      .toHaveTextContent(SurveyItemTypeData[SurveyItemType.FREE_RESPONSE].label);
  });

  it('renders the prompt', () => {
    defaultRender();

    expect(query('.item-results-prompt p')).toHaveTextContent('prompt1?');
  });

  it('has a heading for the actual item responses', () => {
    defaultRender();

    expect(query('.item-results h5')).toHaveTextContent('Responses');
  });

  it('renders the right results component for the itemType - FREE_RESPONSE', () => {
    defaultRender();

    expect(query('.free-response-results')).toBeInTheDocument();
  });

  it('renders the right results component for the itemType - MULTIPLE_CHOICE', () => {
    customRender(
      <ItemResults surveyItemId={initialState.surveys.surveyItems.item3.uuid} />,
      initialState
    );

    expect(query('.multiple-choice-results')).toBeInTheDocument();
  });

  it('renders the right results component for the itemType - MULTIPLE_SELECT', () => {
    customRender(
      <ItemResults surveyItemId={initialState.surveys.surveyItems.item4.uuid} />,
      initialState
    );

    expect(query('.multiple-select-results')).toBeInTheDocument();
  });
});