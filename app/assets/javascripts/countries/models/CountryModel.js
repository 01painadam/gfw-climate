define([
  'backbone',
  'jquery'
], function(Backbone, $) {

  var CountryModel = Backbone.Model.extend({

    url: '/api/countries/',

    setCountry: function(country) {
      this.url += country;
    },

    parse: function(data) {
      return data.country;
    }

  });

  return new CountryModel();

});