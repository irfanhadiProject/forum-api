const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'ini body',
    };

    const owner = 'user-123';

    // Expected result
    const expectedAdded = new AddedThread({
      id: 'thread-123',
      title: payload.title,
      owner,
    });

    // Mocking
    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.addThread = jest.fn().mockResolvedValue(expectedAdded);

    // Action
    const useCase = new AddThreadUseCase({
      threadRepository: mockThreadRepo,
    });

    const result = await useCase.execute(payload, owner);

    // Assert
    expect(mockThreadRepo.addThread).toHaveBeenCalledWith(
      new AddThread(payload),
      owner
    );

    expect(result).toStrictEqual(expectedAdded);
  });
});
