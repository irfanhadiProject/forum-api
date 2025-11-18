class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId }) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadDetail = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(
      threadId
    );

    return {
      ...threadDetail,
      comments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
