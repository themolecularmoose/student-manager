'use strict';

exports.find = function(req, res, next){
  var outcome = {};

  var getStatusOptions = function(callback) {
    req.app.db.models.Status.find({ pivot: 'Student' }, 'name').sort('name').exec(function(err, statuses) {
      if (err) {
        return callback(err, null);
      }

      outcome.statuses = statuses;
      return callback(null, 'done');
    });
  };

  var getResults = function(callback) {
    req.query.search = req.query.search ? req.query.search : '';
    req.query.status = req.query.status ? req.query.status : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '_id';

    var filters = {};
    if (req.query.search) {
      filters.search = new RegExp('^.*?'+ req.query.search +'.*$', 'i');
    }

    if (req.query.status) {
      filters['status.id'] = req.query.status;
    }

    req.app.db.models.Student.pagedFind({
      filters: filters,
      keys: 'name course games userCreated status',
      limit: req.query.limit,
      page: req.query.page,
      sort: req.query.sort
    }, function(err, results) {
      if (err) {
        return callback(err, null);
      }

      outcome.results = results;
      return callback(null, 'done');
    });
  };

  var asyncFinally = function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      outcome.results.filters = req.query;
      res.send(outcome.results);
    }
    else {
      outcome.results.filters = req.query;
      res.render('admin/students/index', {
        data: {
          results: escape(JSON.stringify(outcome.results)),
          statuses: outcome.statuses
        }
      });
    }
  };

  require('async').parallel([getStatusOptions, getResults], asyncFinally);
};

exports.read = function(req, res, next){
  var outcome = {};

  var getStatusOptions = function(callback) {
    req.app.db.models.Status.find({ pivot: 'Student' }, 'name').sort('name').exec(function(err, statuses) {
      if (err) {
        return callback(err, null);
      }

      outcome.statuses = statuses;
      return callback(null, 'done');
    });
  };

  var getRecord = function(callback) {
    req.app.db.models.Student.findById(req.params.id).exec(function(err, record) {
      if (err) {
        return callback(err, null);
      }

      outcome.record = record;
      return callback(null, 'done');
    });
  };

  var asyncFinally = function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(outcome.record);
    }
    else {
      res.render('admin/students/details', {
        data: {
          record: escape(JSON.stringify(outcome.record)),
          statuses: outcome.statuses
        }
      });
    }
  };

  require('async').parallel([getStatusOptions, getRecord], asyncFinally);
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.first) {
      workflow.outcome.errfor.first = 'required';
    }

    if (!req.body.last) {
      workflow.outcome.errfor.last = 'required';
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('patchStudent');
  });

  workflow.on('patchStudent', function() {
    var fieldsToSet = {
      name: {
        first: req.body.first,
        middle: req.body.middle,
        last: req.body.last,
        full: req.body.first +' '+ req.body.last
      },
      company: req.body.company,
      phone: req.body.phone,
      zip: req.body.zip,
      search: [
        req.body.first,
        req.body.middle,
        req.body.last,
        req.body.company,
        req.body.phone,
        req.body.zip
      ]
    };

    req.app.db.models.Student.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, student) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.student = student;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.newNote = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.data) {
      workflow.outcome.errors.push('Data is required.');
      return workflow.emit('response');
    }

    workflow.emit('addNote');
  });

  workflow.on('addNote', function() {
    var noteToAdd = {
      data: req.body.data,
      userCreated: {
        id: req.user._id,
        name: req.user.username,
        time: new Date().toISOString()
      }
    };

    req.app.db.models.Student.findByIdAndUpdate(req.params.id, { $push: { notes: noteToAdd } }, function(err, student) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.student = student;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.newStatus = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.body.id) {
      workflow.outcome.errors.push('Please choose a status.');
    }

    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('addStatus');
  });

  workflow.on('addStatus', function() {
    var statusToAdd = {
      id: req.body.id,
      name: req.body.name,
      userCreated: {
        id: req.user._id,
        name: req.user.username,
        time: new Date().toISOString()
      }
    };

    req.app.db.models.Student.findByIdAndUpdate(req.params.id, { status: statusToAdd, $push: { statusLog: statusToAdd } }, function(err, student) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.student = student;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete students.');
      return workflow.emit('response');
    }

    workflow.emit('deleteStudent');
  });

  workflow.on('deleteStudent', function(err) {
    req.app.db.models.Student.findByIdAndRemove(req.params.id, function(err, student) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.student = student;
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
