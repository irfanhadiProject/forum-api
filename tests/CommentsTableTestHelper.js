/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    owner = 'user-123',
    content = 'sebuah komentar di thread',
    isDeleted = false,
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: `
      INSERT INTO comments(id, thread_id, owner, content, is_deleted, created_at)
      VALUES($1, $2, $3, $4, $5, $6)
      `,
      values: [id, threadId, owner, content, isDeleted, createdAt],
    };

    await pool.query(query);
    return id;
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
