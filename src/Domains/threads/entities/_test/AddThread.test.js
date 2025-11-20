const AddThread = require('../AddThread');

describe('AddThread entity', () => {
  it('should throw error when payload missing required properties', () => {
    const payload = {
      title: 'judul',
    };

    expect(() => new AddThread(payload)).toThrow(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload data types are invalid', () => {
    const payload = {
      title: 123,
      body: true,
    };

    expect(() => new AddThread(payload)).toThrow(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create AddThread entity correctly', () => {
    const payload = {
      title: 'judul',
      body: 'isi thread',
    };

    const addThread = new AddThread(payload);

    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
  });
});
