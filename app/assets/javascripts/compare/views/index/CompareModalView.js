define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'chosen',
  'views/SourceWindowView',
  'compare/presenters/CompareModalPresenter',
  'text!compare/templates/compareModal.handlebars'
], function($, Backbone, _, Handlebars, chosen, SourceWindowView, CompareModalPresenter, tpl) {

  'use strict';

  var CountryModalView = SourceWindowView.extend({

    template: Handlebars.compile(tpl),

    el: '.source_window',

    areas : [{ name: 'Tree plantations',id: 1,},{ name: 'Protected areas',id: 2,},{ name: 'Primary forests',id: 3,},{ name: 'Moratorium areas',id: 4,},{ name: 'Mining concessions',id: 5,},{ name: 'Logging concessions',id: 6,},{ name: 'Plantation concessions',id: 7,},{ name: 'Key biodiversity areas',id: 8,}],

    events: function() {
      return _.extend({}, SourceWindowView.prototype.events, {
        'click .m-modal--tablink' : 'changeTab',
        'click .m-field-list-radio-jurisdiction' : 'changeJurisdiction',
        'click .m-field-list-radio-area' : 'changeArea',
        'click #btnModalContinue' : 'continue',
        'change .chosen-select' : 'changeIso',
      });
    },

    initialize: function() {
      // Inits
      this.constructor.__super__.initialize.apply(this);
      this.$el.addClass('is-huge');
      // Presenter & status
      this.presenter = new CompareModalPresenter(this);
      this.status = this.presenter.status;
      // Listeners
      // this.setListeners();
    },

    setListeners: function() {
    },

    render: function() {
      this.$el.html(this.template(this.parseData()));
      this.cacheVars();
      this.inits();
    },

    parseData: function() {
      // Ooops!!! This should be served by the API //
      var country1  = this.status.get('country1');
      var country2  = this.status.get('country2');
      (country1) ? country1.areas = this.areas : null;
      (country2) ? country2.areas = this.areas : null;
      // ***** //
      return {
        countries: this.status.get('countries'),
        country1: country1,
        country2: country2,
      };
    },

    cacheVars: function() {
      this.$wrapper = $('.content-wrapper');
      this.$selects = $('.chosen-select');
      this.$radios = $('.m-field-list-radio');
      this.$tablinks = $('.m-modal--tablink');
      this.$tabs = $('.m-modal--tab');
    },

    inits: function() {
      this.$selects.chosen({
        width: '100%',
        // inherit_select_classes: true,
      });
      this.setTab();
    },

    /*
      MODAL: Modal events (extends from 'SourceWindow Class')
      - show
      - hide
    */
    show: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      this.model.set('hidden', false);
      this.$htmlbody.addClass('active');
    },

    hide: function(e) {
      e && e.preventDefault();
      this.model.set('hidden', true);
      this.$htmlbody.removeClass('active');
      if(!!this.status.get('compare1') && !!this.status.get('compare2')) {
        this.presenter.changeSelection();
      }

    },

    continue: function(e) {
      e && e.preventDefault();
      (!!!this.status.get('compare1')) ? this.presenter.changeTab(1) : null;
      (!!!this.status.get('compare2')) ? this.presenter.changeTab(2) : null;
      if(!!this.status.get('compare1') && !!this.status.get('compare2')) {
        this.hide();
      }
    },

    /*
      CHANGERS: Change values events
      - changeTab
      - changeIso
      - changeJurisdiction
      - changeArea
    */
    changeTab: function(e) {
      this.presenter.changeTab($(e.currentTarget).data('tab'));
    },

    changeIso: function(e) {
      this.presenter.changeIso($(e.currentTarget).val());
      (!!$(e.currentTarget).val()) ? this.$wrapper.addClass('is-loading') : null;
    },

    changeJurisdiction: function(e) {
      var jurisdiction = ($(e.currentTarget).hasClass('is-active')) ? 0 : $(e.currentTarget).data('id');
      this.presenter.changeJurisdiction(jurisdiction);
    },

    changeArea: function(e) {
      var area = ($(e.currentTarget).hasClass('is-active')) ? 0 : $(e.currentTarget).data('id');
      this.presenter.changeArea(area);
    },

    /*
      SETTERS: Set selected values by params
      - setTab
      - setCompare
    */
    setTab: function(tab) {
      var tab = this.status.get('tab');

      // Tablinks
      this.$tablinks.removeClass('is-active');
      this.$el.find('.m-modal--tablink[data-tab='+tab+']').addClass('is-active');

      // Tabs
      this.$tabs.removeClass('is-active');
      $('#selection'+tab).addClass('is-active');

      // Scroll
      this.$wrapper.scrollTop(0);
    },

    setCompare: function(who,compare) {
      this.$wrapper.removeClass('is-loading');
      if (compare) {
        var $select = $('#selection'+who).find('select'),
            $selectChosen = $('#selection'+who).find('.chosen-container'),
            $areas = $('#selection'+who).find('.compare-area'),
            $jurisdictions = $('#selection'+who).find('.compare-jurisdiction'),
            $radios = $('#selection'+who).find('.m-field-list-radio');

        // Set selects
        $select.toggleClass('with-selection',!!compare.iso);
        $selectChosen.toggleClass('with-selection',!!compare.iso);
        $select.val(compare.iso);
        $select.trigger('chosen:updated');

        // Set areas and jurisdiction
        $radios.removeClass('is-active');
        if (!!compare.area) {
          $areas.find('li[data-id='+compare.area+']').addClass('is-active');
        }
        if (!!compare.jurisdiction) {
          $jurisdictions.find('li[data-id='+compare.jurisdiction+']').addClass('is-active');
        }
      }
    },

  });

  return CountryModalView;

});