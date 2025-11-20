const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
  it('should throw error when payload missing required properties', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
    };

    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data types are invalid', () => {
    const payload = {
      id: 123,
      title: 'judul',
      owner: {},
    };

    expect(() => new AddedThread(payload)).toThrow(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddedThread entity correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'judul',
      owner: 'user-123',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
