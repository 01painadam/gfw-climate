define([
  'backbone',
  'mps',
  'countries/presenters/show/WidgetGridPresenter',
  'widgets/views/WidgetView',
  'countries/views/show/reports/NationalView',
  'countries/views/show/reports/SubNationalView',
  'countries/views/show/reports/AreasView',
], function(Backbone, mps, WidgetGridPresenter, WidgetView, NationalView,
    SubNationalView, AreasView) {

  'use strict';

  var CountryWidgetsView = Backbone.View.extend({

    el: '#reports',

    events: {
      'click .addIndicators' : '_showModal'
    },

    initialize: function() {
      this.presenter = new WidgetGridPresenter(this);

      this._setListeners();
      this._cacheVars();
    },

    start: function() {
      this.render();
    },

    _setListeners: function() {},

    _cacheVars: function() {
      this.$moreIndicatorsWarning = $('.more-indicators-warning');
      this.$noIndicatorsWarning = $('.no-indicators-warning');
    },

    _toggleWarnings: function() {
      var view = this.presenter.status.get('view');

      if (view === 'national') {
        this.$noIndicatorsWarning.addClass('is-hidden');
        this.$moreIndicatorsWarning.removeClass('is-hidden');
      }
      else {

        if(view === 'subnational' && !this.presenter.status.get('jurisdictions') ||
          view === 'areas-interest' && !this.presenter.status.get('areas')) {

          this.$moreIndicatorsWarning.addClass('is-hidden');
        }
      }
    },

    _showModal: function(e) {
      e && e.preventDefault();
      mps.publish('Modal/open', [this.presenter.status.get('view')]);
    },

    render: function() {
      console.log('render');

      var subview,
        view = this.presenter.status.get('view');
      var options = {
        parent: this.$el.find('.reports-grid')
      };

      switch(view) {

        case 'national':
          _.extend(options, {
            status: this.presenter.status.get('options')
          });
          new NationalView(options);
          break;
        case 'subnational':
            var opts = $.extend(true, {}, this.presenter.status.get('options'));
            delete opts['areas'];
            delete opts['jurisdictions'];
            delete opts['view'];

          _.extend(options, {
            widgets: opts,
            jurisdictions: this.presenter.status.get('options')['jurisdictions']
          });

          new SubNationalView(options);
          break;
        case 'areas-interest':

          var opts = $.extend(true, {}, this.presenter.status.get('options'));
            delete opts['areas'];
            delete opts['jurisdictions'];
            delete opts['view'];

          _.extend(options, {
            widgets: opts,
            areas: this.presenter.status.get('options')['areas']
          });

          new AreasView(options);
          break;
      }
    }

  });

  return CountryWidgetsView;

});
