define([
  'mps',
  'countries/presenters/PresenterClass'
], function(mps, PresenterClass) {

  var WidgetGridPresenter = PresenterClass.extend({

    init: function(view) {
      this._super();
      this.view = view;
    },

    _subscriptions: [{
      'Widgets/render': function(widgets) {
        this.view.model.set({
          'widgets': widgets
        });
      }
    }, {
      'CountryHeader/switchDisplay': function(display) {
        this.view.model.set({
          'display': display
        });
      }
    }],

  });

  return WidgetGridPresenter;

});
