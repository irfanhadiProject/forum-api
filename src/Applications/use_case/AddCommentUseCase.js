const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, threadId, owner) {
    const addComment = new AddComment(useCasePayload);

    await this._threadRepository.verifyThreadExists(threadId);

    const newComment = {
      content: addComment.content,
      threadId,
      owner,
    };

    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
