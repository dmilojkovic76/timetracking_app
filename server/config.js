module.exports = {
  secret: 'mysupersecretsecret',
  bCryptSalt: 10,
  database: 'mongodb://localhost:27017/timetracking-app',
  serverPort: 3000,
  allowedIPs: [
    '*',
    'http://localhost',
    'https://localhost',
    'http://localhost:8080',
    'http://127.0.0.1',
    'https://127.0.0.1',
    'http://127.0.0.1:8080',
  ],
};
