const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner) {
    const addThread = new AddThread(payload);
    return this._threadRepository.addThread(addThread, owner);
  }
}

module.exports = AddThreadUseCase;
