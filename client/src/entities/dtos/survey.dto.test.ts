import { SurveyDto } from './survey.dto';
import { Survey } from '../survey.model';
import { SurveyItem } from '../survey-item.model';

describe('SurveyDto', () => {
  it('constructs from an object', () => {
    const json = {
      survey: {
        uuid: 'uuid1',
        title: 'title1',
        surveyItems: ['item1', 'item2']
      },
      numberOfResponses: 5,
      expandedItems: [
        {
          uuid: 'item1'
        },
        {
          uuid: 'item2'
        }
      ]
    };

    const dto = new SurveyDto(json as any);

    expect(dto.survey).toHaveProperty('uuid', 'uuid1');
    expect(dto.survey).toBeInstanceOf(Survey);
    expect(dto.numberOfResponses).toBe(5);
    expect(dto.expandedItems).toHaveLength(2);
    expect(dto.expandedItems[0]).toBeInstanceOf(SurveyItem);
    expect(dto.expandedItems[0]).toHaveProperty('uuid', 'item1');
  });
});