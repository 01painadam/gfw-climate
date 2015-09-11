define([
  'backbone',
  'countries/models/CountryModel',
  'countries/presenters/show/CountryHeaderPresenter'
], function(Backbone, CountryModel, CountryHeaderPresenter) {

  var CountryShowHeaderView = Backbone.View.extend({

    el: '#headerCountry',

    events: {
      // 'change #areaSelector': '_setJurisdictions',
      'click #customizeReports': '_openReportPanel'
    },

    initialize: function(arguments) {
      this.model = CountryModel;
      this.presenter = new CountryHeaderPresenter(this);
      // this._populateJurisdictions();
      // this._setDisplay();
    },

    _openReportPanel: function() {
      this.presenter.onOpenReportsPanel();
    }

    // _populateJurisdictions: function() {
    //   var jurisdictions =this.model.get('jurisdictions');
    //   var options = '<option value="default">select jurisdiction</option>';
    //   var $select = $('#areaSelector');

    //   jurisdictions.forEach(function(jurisdiction) {
    //     options += '<option value="' + jurisdiction.id + '">' + jurisdiction.name + '</option>';
    //   });

    //   $select.html(options);
    // }

    // _setJurisdictions: function(e) {
    //   var jurisdiction;
    //   if (e) {
    //     jurisdiction = e.currentTarget;
    //   }

    //   if (jurisdiction.value !== 'default'  && jurisdiction.value !== '') {
    //     Backbone.history.navigate('/countries/' + this.model.get('iso') + '/' + jurisdiction.value, {trigger: true});
    //   }
    // }

  });

  return CountryShowHeaderView;

});
