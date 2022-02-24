import { Response, ResponseType } from "./response.entity";

describe('Response entity', () => {
  let data: any;

  beforeEach(() => {
    data = {
      survey: 'survey123',
      surveyItem: 'item123',
      user: 'user123'
    };
  });

  it('assigns the data passed in and also default values for other fields', () => {
    const resp = new Response(data);

    expect(resp.survey).toBe('survey123');
    expect(resp.surveyItem).toBe('item123');
    expect(resp.user).toBe('user123');
    
    expect(resp.uuid).toBeTruthy();
    expect(resp.createdAt).toBeInstanceOf(Date);
  });

  it('accepts the correct fields for a FREE_RESPONSE_RESPONSE', () => {
    const resp = new Response({
      ...data,
      responseType: ResponseType.FREE_RESPONSE_RESPONSE,
      freeResponse: 'resp123',
      selection: 'a',
      selections: ['a', 'b']
    });

    expect(resp.responseType).toBe(ResponseType.FREE_RESPONSE_RESPONSE);
    expect(resp.freeResponse).toBe('resp123');
    expect(resp.selection).not.toBeDefined();
    expect(resp.selections).not.toBeDefined();
  });
  
  it('accepts the correct fields for a MULTIPLE_CHOICE_RESPONSE', () => {
    const resp = new Response({
      ...data,
      responseType: ResponseType.MULTIPLE_CHOICE_RESPONSE,
      freeResponse: 'resp123',
      selection: 'a',
      selections: ['a', 'b']
    });

    expect(resp.responseType).toBe(ResponseType.MULTIPLE_CHOICE_RESPONSE);
    expect(resp.freeResponse).not.toBeDefined();
    expect(resp.selection).toBe('a');
    expect(resp.selections).not.toBeDefined();
  });
  
  it('accepts the correct fields for a MULTIPLE_SELECT_RESPONSE', () => {
    const resp = new Response({
      ...data,
      responseType: ResponseType.MULTIPLE_SELECT_RESPONSE,
      freeResponse: 'resp123',
      selection: 'a',
      selections: ['a', 'b']
    });

    expect(resp.responseType).toBe(ResponseType.MULTIPLE_SELECT_RESPONSE);
    expect(resp.freeResponse).not.toBeDefined();
    expect(resp.selection).not.toBeDefined();
    expect(resp.selections).toEqual(['a', 'b']);
  });
});