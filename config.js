'use strict';

exports.port = process.env.PORT || 3000;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/student-manager'
};
exports.companyName = 'RIT';
exports.projectName = 'Molecular Mission';
exports.systemEmail = 'molecularmoose@gmail.com';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Website',
    address: process.env.SMTP_FROM_ADDRESS
  },
  credentials: {
    user: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    ssl: true
  }
};
