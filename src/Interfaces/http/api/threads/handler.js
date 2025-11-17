const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, owner);

    const response = h.response({
      status: 'success',
      data: { addedThread },
    });

    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const { threadId } = request.params;

    const useCasePayload = { threadId };

    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name
    );

    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    const response = h.response({
      status: 'success',
      data: {
        thread: threadDetail,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
