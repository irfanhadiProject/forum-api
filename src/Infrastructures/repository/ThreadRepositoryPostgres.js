const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread, owner) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: `
        INSERT INTO threads (id, title, body, owner, date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, title, owner
      `,
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread(result.rows[0]);
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getThreadById(threadId) {
    const threadQuery = {
      text: `
        SELECT t.id, t.title, t.body, t.date, u.username
        FROM threads t
        JOIN users u ON u.id = t.owner
        WHERE t.id = $1
      `,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (!threadResult.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const thread = threadResult.rows[0];

    const commentsQuery = {
      text: `
        SELECT c.id, c.content, c.date, c.is_deleted, u.username
        FROM comments c
        JOIN users u ON u.id = c.owner
        WHERE c.thread_id = $1
        ORDER BY c.date ASC
      `,
      values: [threadId],
    };

    const commentsResult = await this._pool.query(commentsQuery);

    const comments = commentsResult.rows.map((row) => ({
      id: row.id,
      username: row.username,
      date: row.date,
      content: row.is_deleted ? '**komentar telah dihapus**' : row.content,
    }));

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments,
    };
  }
}

module.exports = ThreadRepositoryPostgres;
