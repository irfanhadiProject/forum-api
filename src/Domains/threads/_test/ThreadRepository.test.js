const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke addThread method', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(
      threadRepository.addThread({}, 'user-123')
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when verifyThreadExists method is invoked', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    // Memverifikasi kontrak untuk metode baru
    await expect(
      threadRepository.verifyThreadExists('thread-123')
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
