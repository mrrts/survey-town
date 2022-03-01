import { SurveyItemType } from "../../../constants/SurveyItemType.enum";
import { customRender, query } from "../../../test-utils";
import { TakeContentInterlude } from "./TakeContentInterlude";

describe('TakeContentInterlude', () => {
  let initialState: any;
  let defaultRender: () => any;

  beforeEach(() => {
    initialState = {
      surveys: {
        surveyItems: {
          item1: {
            uuid: 'item1',
            itemType: SurveyItemType.CONTENT_INTERLUDE,
            content: '<p class="content-child">content1</p>'
          }
        }
      }
    };

    defaultRender = () => customRender(
      <TakeContentInterlude surveyItemId="item1" />,
      initialState
    );
  });

  it('has a container that fades in', () => {
    defaultRender();

    const container = () => query('.take-content-interlude-container');

    expect(container()).toBeInTheDocument();
    expect(container()).toHaveClass('animate__animated', 'animate__fadeIn');
  });

  it('has an inner container that renders the item content', () => {
    defaultRender();

    const innerContainer = () => query('.content-interlude-content');
    const content = () => query('p.content-child');

    expect(innerContainer()).toBeInTheDocument();
    expect(innerContainer()).toContainElement(content() as HTMLElement);
  });


});