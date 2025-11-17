const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );

    const { threadId } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;

    const addedComment = await addCommentUseCase.execute(
      { content },
      threadId,
      owner
    );

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;

    const { id: credentialId } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      'DeleteCommentUseCase'
    );

    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: credentialId,
    });

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = CommentsHandler;
