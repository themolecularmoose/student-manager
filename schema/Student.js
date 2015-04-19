'use strict';

exports = module.exports = function(app, mongoose) {
  var studentSchema = new mongoose.Schema({
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' }
    },
    isVerified: { type: String, default: '' },
    verificationToken: { type: String, default: '' },
    name: {
      first: { type: String, default: '' },
      last: { type: String, default: '' },
      full: { type: String, default: '' }
    },
    course: {
      number: { type: String, default: ''},
      year: {type: String, default: new Date().getFullYear() },
      semester: {type: String, default: ''}
    },
    games: [
      {
        datePlayed: { type: Date, default: Date.now},
        score: {type: Number, default: 0},
      }
    ],
    persistance: {
      type: mongoose.Schema.Types.Mixed
    },
    status: {
      id: { type: String, ref: 'Status' },
      name: { type: String, default: '' },
      userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, default: '' },
        time: { type: Date, default: Date.now }
      }
    },
    statusLog: [mongoose.modelSchemas.StatusLog],
    notes: [mongoose.modelSchemas.Note],
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },
    search: [String]
  });
  studentSchema.plugin(require('./plugins/pagedFind'));
  studentSchema.index({ user: 1 });
  studentSchema.index({ 'status.id': 1 });
  studentSchema.index({ search: 1 });
  studentSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Student', studentSchema);
};
