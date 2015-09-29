define([
  'backbone',
  'handlebars',
  'chosen',
  'compare/presenters/CompareSelectorsPresenter',
  'text!compare/templates/compareSelectorTpl.handlebars'
], function(Backbone, Handlebars, chosen, CompareSelectorsPresenter, tpl) {

  var CompareSelectorsView = Backbone.View.extend({

    el: '#compareSelectorsView',

    template: Handlebars.compile(tpl),

    events: {
      'change select' : '_selectCountry'
    },

    initialize:function() {
      this.presenter = new CompareSelectorsPresenter(this);

      this._setListeners();
      this._cacheVars();
    },

    _setListeners: function() {
    },

    _cacheVars: function() {
    },

    _getActiveCountries: function() {
      return _.where(this.collection.toJSON().countries, { 'enabled' : true });
    },

    render: function() {
      var countries = this._getActiveCountries();
      this.$el.html(this.template({'countries': countries}))
      // this._invokeChosen();
      this._stopSpinner();
    },

    _stopSpinner: function() {
      this.$el.removeClass('is-loading');
    },

    /*
     * Set selectors values with url arriving into url.
     */
    setValuesFromUrl: function(data) {
      this.collection = data;

      $.when.apply($, this.render()).done(function() {
        this._setUrlValues();
      }.bind(this));
    },

    _setUrlValues: function() {
      var selectors = ['country1', 'country2', 'country3'];
      var self = this;

      $.each(selectors, function(index, value) {
        var country = self.presenter.status.get(value);
        var selector = '#' + value;

        $(selector).val(country);

        self._disableOptions();
      })
    },

    _selectCountry: function(e) {
      var selector = $(e.currentTarget).attr('id');
      var selectedCountry = $(e.currentTarget).val();

      this.countrySelected(selectedCountry, selector);
    },

    countrySelected: function(country, selector) {
      this._updateStatus(country, selector);
      this._disableOptions();
    },

    _disableOptions: function() {
      this.$el.find('option').removeClass('is-disabled');

      var selectors = ['country1', 'country2', 'country3'];
      var self = this;

      $.each(selectors, function(index, value) {
        var countries = ['country1', 'country2', 'country3'];
        var index = countries.indexOf(value);

        if (index > -1) {
          countries.splice(index, 1);
        }

        var country = self.presenter.status.get(value);

        if (country !== 'no_country') {
          $.each(countries, function(index, value) {
            $('#' + value).find('[value='+ country +']').addClass('is-disabled');
          })
        }
      })
    },

    _updateStatus: function(country, selector) {
      this.presenter.updateStatus(selector, country);
    },

    enableComparisonBtn: function() {
      console.log('you');
    },

    _invokeChosen: function() {
      var countrySelectors = ['#country1', '#country2', '#country3'];
      for(var i = 0; i < countrySelectors.length; i++) {
        $(countrySelectors[i]).chosen();
      }
    }

  });

  return CompareSelectorsView;

});
