/* istanbul ignore file */
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');
const Jwt = require('@hapi/jwt');

const AuthenticationTestHelper = {
  async getAccessToken(payload) {
    const tokenManager = new JwtTokenManager(Jwt.token);
    return tokenManager.createAccessToken(payload);
  },
};

module.exports = AuthenticationTestHelper;
