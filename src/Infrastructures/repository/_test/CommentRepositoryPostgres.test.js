const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: 'dicoding' });
    await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return AddedComment correctly', async () => {
      // Arrage
      const newComment = {
        content: 'sebuah komentar di thread',
        threadId,
        owner: userId,
      };

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepository.addComment(newComment);

      // Asserts
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-123'
      );
      expect(comments).toHaveLength(1);
      expect(comments[0].content).toEqual(newComment.content);
      expect(comments[0].thread_id).toEqual(threadId);
      expect(comments[0].owner).toEqual(userId);
      expect(comments[0].is_deleted).toBe(false);

      expect(addedComment).toBeInstanceOf(AddedComment);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: newComment.content,
          owner: newComment.owner,
        })
      );
    });

    it('should throw InvariantError when insertion fails', async () => {
      // Arrange
      const newComment = {
        content: 'sebuah komentar di thread',
        threadId: threadId,
        owner: userId,
      };

      const fakeIdGenerator = () => '123';

      const mockPool = {
        query: jest.fn(() => Promise.resolve({ rowCount: 0, rows: [] })),
      };
      const commentRepository = new CommentRepositoryPostgres(
        mockPool,
        fakeIdGenerator
      );

      // Action & Assert
      await expect(
        commentRepository.addComment(newComment)
      ).rejects.toThrowError(InvariantError);
    });
  });
});
