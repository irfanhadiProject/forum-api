const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return AddedThread correctly', async () => {
      // Arrange
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });

      const payload = new AddThread({
        title: 'judul thread',
        body: 'isi thread',
      });

      const fakeIdGenerator = () => '123';
      const repository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await repository.addThread(payload, owner);

      // Assert DB
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
      expect(threads[0].title).toBe('judul thread');
      expect(threads[0].owner).toBe(owner);
      expect(threads[0].body).toBe('isi thread');
      expect(threads[0].date).toBeDefined();

      // Assert return
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'judul thread',
          owner,
        })
      );
    });
  });

  describe('verifyThreadExists', () => {
    it('should throw NotFoundError when thread is not found', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});
      const nonExistentThreadId = 'thread-999';

      // Action & Assert
      await expect(
        repository.verifyThreadExists(nonExistentThreadId)
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is found', async () => {
      // Arrange
      const repository = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-123';
      const userId = 'user-123';

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        owner: userId,
      });

      // Action & Assert
      await expect(
        repository.verifyThreadExists(threadId)
      ).resolves.not.toThrowError();
    });
  });

  describe('getThreadById', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      const repository = new ThreadRepositoryPostgres(pool, {});
      await expect(repository.getThreadById('thread-xxx')).rejects.toThrowError(
        NotFoundError
      );
    });

    it('should return thread detail with empty comments when no comments exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
        date: '2023-01-01T10:00:00.000Z',
      });

      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.id).toBe('thread-123');
      expect(thread.title).toBe('Thread Title');
      expect(thread.body).toBe('Thread Body');
      expect(thread.username).toBe('john');
      expect(thread.comments).toHaveLength(0);
    });

    it('should return thread detail with comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'doe' });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
        date: '2023-01-01T10:00:00.000Z',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'komentar pertama',
        threadId: 'thread-123',
        owner: 'user-456',
        date: '2023-01-02T10:00:00.000Z',
      });

      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.comments).toHaveLength(1);
      expect(thread.comments[0].id).toBe('comment-123');
      expect(thread.comments[0].username).toBe('doe');
      expect(thread.comments[0].content).toBe('komentar pertama');
      expect(thread.comments[0].date).toBeDefined();
    });

    it('should return "**komentar telah dihapus**" for deleted comments', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'john' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'doe' });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread Body',
        owner: 'user-123',
        date: '2023-01-01T10:00:00.000Z',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'komentar pertama',
        threadId: 'thread-123',
        owner: 'user-456',
        date: '2023-01-02T10:00:00.000Z',
        isDeleted: true,
      });

      const repository = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await repository.getThreadById('thread-123');

      // Assert
      expect(thread.comments).toHaveLength(1);
      expect(thread.comments[0].content).toBe('**komentar telah dihapus**');
    });
  });
});
