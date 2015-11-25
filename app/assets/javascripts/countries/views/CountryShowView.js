define([
  'backbone',
  'countries/views/show/FixedHeaderView',
  'countries/views/show/CountryShowHeaderView',
  'countries/views/show/TabsView',
  'countries/views/show/CountryModalView',
  'countries/views/show/WidgetGridView'
], function(Backbone, FixedHeaderView,
  CountryShowHeaderView, TabsView, CountryModalView, WidgetGridView) {

  'use strict';

  var CountryShowView = Backbone.View.extend({

    initialize: function() {
      new CountryShowHeaderView();
      new CountryModalView();
      new FixedHeaderView();
      new TabsView();
      new WidgetGridView();
    }

  });

  return CountryShowView;

});
