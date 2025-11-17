const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');

describe('/threads/{threadId}/comments endpoint', () => {
  const userPayload = {
    username: 'testkomen',
    password: 'secret',
    fullname: 'Test Komen User',
  };
  const validThreadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'threadowner',
    });
    await ThreadsTableTestHelper.addThread({
      id: validThreadId,
      owner: 'user-123',
    });
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  it('should response 201 and persisted comment for valid request', async () => {
    // Arrange
    const requestPayload = {
      content: 'Ini adalah komentar pertama.',
    };
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${validThreadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();

    const addedComment = responseJson.data.addedComment;
    expect(addedComment.content).toEqual(requestPayload.content);
    expect(addedComment.id).toBeDefined();
    expect(addedComment.owner).toBeDefined();

    const comments = await CommentsTableTestHelper.findCommentById(
      addedComment.id
    );
    expect(comments).toHaveLength(1);
  });

  it('should response 401 when request does not have access token', async () => {
    // Arrange
    const server = await createServer(container);
    const requestPayload = { content: 'Komentar tanpa token.' };

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${validThreadId}/comments`,
      payload: requestPayload,
    });

    // Assert
    expect(response.statusCode).toEqual(401);
    const responseJson = JSON.parse(response.payload);
    expect(responseJson.message).toEqual('Missing authentication');
  });

  it('should response 404 when threadId is not found', async () => {
    // Arrange
    const invalidThreadId = 'thread-999'; //
    const requestPayload = { content: 'Komentar di thread yang tidak ada.' };
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${invalidThreadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(404);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });

  it('should response 400 when request payload does not contain required property', async () => {
    // Arrange
    const requestPayload = {};
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${validThreadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });

  it('should response 400 when request payload does not meet data type specification', async () => {
    // Arrange
    const requestPayload = { content: 12345 };
    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });
    const {
      data: { accessToken },
    } = JSON.parse(loginResponse.payload);

    // Action
    const response = await server.inject({
      method: 'POST',
      url: `/threads/${validThreadId}/comments`,
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual('fail');
    expect(responseJson.message).toBeDefined();
  });
});
