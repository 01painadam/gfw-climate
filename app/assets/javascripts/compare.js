/**
 * Application entry point.
 */
require([
  'jquery',
  'underscore',
  'Class',
  'backbone',
  '_string',
  'compare/router',
  'compare/views/CompareIndexView'
], function($, _, Class, Backbone, _string, RouterView, CompareIndexView) {

  'use strict';

  var ComparePage = Backbone.View.extend({

    el: document.body,

    initialize: function() {
      this._initRouter();
      this._initViews();
      this._initApp();
    },

    /**
     * Initialize the map by starting the history.
     */
    _initApp: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({pushState: true});
      }
    },

    _initRouter: function() {
      this.router = new RouterView();
    },

    _initViews: function() {
      new CompareIndexView();
    }

  });

  new ComparePage();

});