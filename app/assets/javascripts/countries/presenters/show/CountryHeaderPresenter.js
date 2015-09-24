define([
  'mps',
  'countries/presenters/PresenterClass'
], function(mps, PresenterClass) {

  'use strict';

  var CountryHeaderPresenter = PresenterClass.extend({

    init: function(view) {
      this._super();
      this.view = view

      mps.publish('Place/register', [this]);
    },

    /**
     * Application subscriptions.
     */
    _subscriptions: [{}]

  });

  return CountryHeaderPresenter;

});
