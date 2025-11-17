class GetThreadDetailUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ threadId }) {
    await this._threadRepository.verifyThreadExists(threadId);

    const threadDetail = await this._threadRepository.getThreadById(threadId);

    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
