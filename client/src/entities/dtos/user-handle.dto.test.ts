import { UserHandleDto } from "./user-handle.dto";

describe('UserHandleDto', () => {
  it('constructs from an object', () => {
    const json = {
      uuid: 'uuid1',
      handle: 'Handle_1'
    };

    const dto = new UserHandleDto(json);

    expect(dto.uuid).toBe('uuid1');
    expect(dto.handle).toBe('Handle_1');
  });
});