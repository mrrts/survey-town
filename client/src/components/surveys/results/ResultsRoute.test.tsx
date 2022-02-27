import { RenderResult } from "@testing-library/react";
import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { RequestStatus } from "../../../store/requests/slice";
import { clearResponsesForSurvey, fetchResponsesForSurvey } from "../../../store/surveys/slice";
import { customRender, query, queryAll } from "../../../test-utils";
import { ResultsRoute } from "./ResultsRoute";

describe('ResultsRoute', () => {
  let initialState: any;
  let defaultRender: () => any;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          survey1: { uuid: 'survey1', title: 'Survey 1', surveyItems: ['item1', 'item2', 'item3'] }
        },
        surveyItems: {
          item1: { uuid: 'item1', itemType: SurveyItemType.FREE_RESPONSE, prompt: 'prompt1' },
          item2: { uuid: 'item2', itemType: SurveyItemType.FREE_RESPONSE, prompt: 'prompt2' },
          item3: { uuid: 'item3', itemType: SurveyItemType.MULTIPLE_CHOICE, prompt: 'prompt3', choices: ['a', 'b'] },
        }, 
        anonSurveyResponses: {}
      }
    };

    defaultRender = () => customRender(
      <ResultsRoute surveyId='survey1' />,
      initialState
    )
  });

  it('clears responses for the survey, then re-fetches the respones', () => {
    const { mockStore } = defaultRender();

    expect(mockStore.dispatch).toHaveBeenCalledWith(clearResponsesForSurvey({ surveyId: 'survey1' }));
    expect(mockStore.dispatch).toHaveBeenCalledWith(fetchResponsesForSurvey({ surveyId: 'survey1' }));
  });

  it('shows a spinner while the fetch-responses request is PENDING', () => {
    initialState = {
      ...initialState,
      requests: {
        requests: {
          fetch_responses_for_survey_survey1: { state: RequestStatus.PENDING }
        }
      }
    };

    customRender(
      <ResultsRoute surveyId='survey1' />,
      initialState
    );

    expect(query('.results-container')).not.toBeInTheDocument();
    expect(query('.spinner-wrapper')).toBeInTheDocument();
  });

  it('shows a results page that fades in', () => {
    defaultRender();

    expect(query('.results-container')).toHaveClass('animate__animated');
    expect(query('.results-container')).toHaveClass('animate__fadeIn');
  });

  it('has a link back to the surveys list', () => {
    defaultRender();

    const link = query('.results-container > a[href="/surveys"]');

    expect(link).toBeInTheDocument();
    expect(link?.querySelector('.mock-fa-icon')).toHaveAttribute('data-icon', 'arrow-left')
    expect(link).toHaveTextContent('Back to surveys list');
  });

  it('has a heading for the results page', () => {
    defaultRender();

    const heading = query('.results-container > h2');

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Results for "Survey 1"');
  });

  it('renders an ItemResults for each survey item', () => {
    defaultRender();

    const itemResults = queryAll('.results-container .item-results');

    expect(itemResults).toHaveLength(3);
  });
});