const DetailComment = require('../DetailComment');

describe('DetailComment entity', () => {
  it('should throw error when payload missing required property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when data types do not match', () => {
    // Arrange
    const payload = {
      id: 123,
      username: {},
      date: 999,
      content: [],
    };

    // Action & Assert
    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create DetailComment correctly (not deleted)', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:26:21.338Z',
      content: 'ini comment',
      is_deleted: false,
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment.content).toEqual('ini comment');
  });

  it('should replace content if comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:26:21.338Z',
      content: 'harusnya diganti',
      is_deleted: true,
    };

    // Action
    const comment = new DetailComment(payload);

    // Assert
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });
});
