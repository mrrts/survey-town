import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { fetchOwnResponsesForSurvey, setCurrentTakingSurveyItem } from "../../../store/surveys/slice";
import { customRender, CustomRenderResult, debug, query, wait } from "../../../test-utils";
import { TakeSurvey } from "./TakeSurvey";

describe('TakeSurvey', () => {
  let initialState: any;
  let defaultRender: () => CustomRenderResult;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveys: {
          survey1: {
            uuid: 'survey1',
            title: 'title1',
            surveyItems: ['item1', 'item2', 'item3']
          }
        },
        surveyItems: {
          item1: { uuid: 'item1', itemType: SurveyItemType.CONTENT_INTERLUDE, content: 'content1' },
          item2: { uuid: 'item2', itemType: SurveyItemType.FREE_RESPONSE, prompt: 'prompt1?' },
          item3: { uuid: 'item3', itemType: SurveyItemType.MULTIPLE_CHOICE, prompt: 'prompt1?', choices: ['a', 'b'] },
        },
        takingSurveySubmittedItemData: {}
      }
    };

    defaultRender = () => customRender(
      <TakeSurvey surveyId="survey1" />,
      initialState
    );
  });

  it('fetches the user\'s own responses for the survey', async () => {
    const { mockStore } = defaultRender();

    await wait(100); // because of async validation state changing

    expect(mockStore.dispatch).toHaveBeenCalledWith(fetchOwnResponsesForSurvey({ surveyId: 'survey1' }));
  });

  it('sets the currently-taking survey item', async () => {
    const { mockStore } = defaultRender();

    await wait(100); // because of async validation state changing

    expect(mockStore.dispatch).toHaveBeenCalledWith(setCurrentTakingSurveyItem({ surveyItemId: 'item1' }));
  });

  it('displays a container with the current item in the survey the user is taking', async () => {
    defaultRender();

    await wait(100); // because of async validation state changing

    expect(query('.current-item-container')).toBeInTheDocument();
    expect(query('.take-content-interlude-container')).toBeInTheDocument();
  });
});