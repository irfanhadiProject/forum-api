class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, date, content, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, username, date, content }) {
    if (!id || !username || !date || content === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailComment;
