/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Signup = Backbone.Model.extend({
    url: '/signup/',
    defaults: {
      errors: [],
      errfor: {},
      username: '',
      firstName: '',
      lastName: '',
      course: '',
      semester: '',
      email: '',
      password: ''
    }
  });

  app.SignupView = Backbone.View.extend({
    el: '#signup',
    template: _.template( $('#tmpl-signup').html() ),
    events: {
      'submit form': 'preventSubmit',
      'keypress [name="password"]': 'signupOnEnter',
      'click .btn-signup': 'signup'
    },
    initialize: function() {
      this.model = new app.Signup();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="username"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    signupOnEnter: function(event) {
      if (event.keyCode !== 13) { return; }
      if ($(event.target).attr('name') !== 'password') { return; }
      event.preventDefault();
      this.signup();
    },
    signup: function() {
      this.$el.find('.btn-signup').attr('disabled', true);

      this.model.save({
        username: this.$el.find('[name="username"]').val(),
        email: this.$el.find('[name="email"]').val(),
        password: this.$el.find('[name="password"]').val(),
        course: this.$el.find('[name="course"]').val(),
        semester: this.$el.find('[name="semester"]').val(),
        firstName: this.$el.find('[name="firstName"]').val(),
        lastName: this.$el.find('[name="lastName"]').val()
      },{
        success: function(model, response) {
          if (response.success) {
            location.href = '/game/';
          }
          else {
            model.set(response);
          }
        }
      });
    }
  });

  $(document).ready(function() {
    app.signupView = new app.SignupView();
  });
}());
