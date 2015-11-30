define([
  'backbone',
  'compare/views/index/CompareSelectorsView',
  'compare/views/index/CompareGridView',
  'compare/views/index/CompareModalView',
  'compare/views/index/CompareFixedHeaderView',
  'compare/views/index/CompareGridButtonBoxView',
  'compare/views/index/CompareWidgetsModalView',
  // Common views
  'views/SourceModalView',
], function(Backbone, CompareSelectorsView, CompareGridView, CompareModalView, CompareFixedHeaderView, CompareGridButtonBoxView, CompareWidgetsModalView, SourceModalView) {

  var CompareIndexView = Backbone.View.extend({

    initialize:function() {
      new CompareSelectorsView();
      new CompareGridView();
      new CompareModalView();
      new CompareFixedHeaderView();
      new CompareGridButtonBoxView();
      new CompareWidgetsModalView();
      // Common views
      new SourceModalView();
    }

  });

  return CompareIndexView;

});
