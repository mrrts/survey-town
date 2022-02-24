import { ISurvey, Survey } from "./survey.entity";

describe('Survey entity', () => {
  let data: Partial<ISurvey>;

  beforeEach(() => {
    data = {
      author: 'user123',
      title: 'title123',
      description: 'desc123'
    };
  });

  it('assigns passed-in values', () => {
    const survey = new Survey(data);
    expect(survey.author).toBe(data.author);
    expect(survey.title).toBe(data.title);
    expect(survey.description).toBe(data.description);
  });

  it('assigns default values for the other fields', () => {
    const survey = new Survey(data);
    expect(survey.uuid).toBeTruthy();
    expect(survey.createdAt).toBeInstanceOf(Date);
    expect(survey.updatedAt).toBeInstanceOf(Date);
    expect(survey.responsesPublic).toBe(true);
    expect(survey.surveyItems).toEqual([]);
  });

  it('doesn\'t assign properties that aren\'t in the schema', () => {
    const survey: any = new Survey({
      ...data,
      foo: 'foo1',
      bar: 'bar1'
    });

    expect(survey.title).toBe(data.title);
    expect(survey.foo).not.toBeDefined();
    expect(survey.bar).not.toBeDefined();
  });
});