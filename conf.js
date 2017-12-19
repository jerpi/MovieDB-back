const auth = require('./conf-secret');

module.exports = {
    api_token: auth.token,
    proxy: {
        host: 'proxy.enib.fr',
        port: 3128,
        username: auth.username,
        password: auth.password,
    },
};