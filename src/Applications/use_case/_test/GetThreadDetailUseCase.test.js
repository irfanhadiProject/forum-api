const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedThreadDetail = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2023-01-01T10:00:00.000Z',
      username: 'john',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'doe',
        date: '2023-01-02T10:00:00.000Z',
        content: 'komentar pertama',
      },
    ];

    // mock repository
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockResolvedValue(expectedThreadDetail);

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockResolvedValue(expectedComments);

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await useCase.execute({ threadId });

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(result).toEqual({
      ...expectedThreadDetail,
      comments: expectedComments,
    });
  });

  it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
    const threadId = 'thread-xxx';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockRejectedValue(new NotFoundError('THREAD.NOT_FOUND'));

    const useCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(useCase.execute({ threadId })).rejects.toThrow(NotFoundError);
  });
});
