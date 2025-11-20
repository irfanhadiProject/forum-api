const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoke unimplemented addComment', async () => {
    // Arrange
    const repository = new CommentRepository();

    const newCommentPayload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action & Assert
    await expect(repository.addComment(newCommentPayload)).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED',
    );
  });

  it('should throw error when invoke unimplemented verifyCommentOwner', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(
      commentRepository.verifyCommentOwner('comment-123', 'user-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented deleteCommentById', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(
      commentRepository.deleteCommentById('comment-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when invoke unimplemented getCommentsByThreadId', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(
      commentRepository.getCommentsByThreadId('thread-123'),
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
