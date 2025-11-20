/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../src/Infrastructures/security/JwtTokenManager');

const AuthenticationTestHelper = {
  async getAccessToken(payload) {
    const tokenManager = new JwtTokenManager(Jwt.token);
    return tokenManager.createAccessToken(payload);
  },
};

module.exports = AuthenticationTestHelper;
