define([
  'backbone',
  'handlebars',
  'text!countries/templates/country-areas-grid.handlebars'
], function(Backbone, Handlebars, tpl) {

  var AreasView = Backbone.View.extend({

    el: '.reports-grid',

    template: Handlebars.compile(tpl),

    events: {
      'click .areaSelector': '_toggleAvailableAreas',
      'click .available-areas-menu span' : '_selectArea',
      'click #submitAreas': '_setAreas'
    },

    initialize: function(model) {
      this.model = model;

    },

    _toggleAvailableAreas: function() {
      $('.available-areas-menu').toggleClass('is-hidden');
    },

    _selectArea: function(e) {
      $(e.currentTarget).parent().toggleClass('is-selected');
    },

    _setAreas: function() {
      // Set areas in model
      this._toggleAvailableAreas();
    },

    render: function() {
      this.$el.html(this.template);

      return this;
    }

  });

  return AreasView;

});