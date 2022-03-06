import { User } from "./user.model";

describe('User', () => {
  it('constructs from an object', () => {
    const json = {
      uuid: 'uuid1',
      emailAddress: 'email@fake.com',
      handle: 'Handle_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: ['USER']
    };

    const user = new User(json);

    expect(user.uuid).toBe(json.uuid);
    expect(user.emailAddress).toBe(json.emailAddress);
    expect(user.handle).toBe(json.handle);
    expect(user.createdAt).toEqual(json.createdAt);
    expect(user.updatedAt).toEqual(json.updatedAt);
    expect(user.roles).toEqual(json.roles);
  });
});