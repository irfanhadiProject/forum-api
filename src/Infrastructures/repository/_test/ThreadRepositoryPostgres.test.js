const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
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
});
