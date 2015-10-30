define([
  'backbone',
  'handlebars',
  'widgets/presenters/TabPresenter',
  'text!widgets/templates/tab.handlebars',
  'widgets/indicators/line/LineChartIndicator',
  'widgets/indicators/map/MapIndicator',
  'widgets/indicators/pie/PieChartIndicator',
  'widgets/indicators/number/NumberChartIndicator',
], function(Backbone, Handlebars, TabPresenter, tpl, LineChartIndicator, MapIndicator, PieChartIndicator, NumberChartIndicator) {

  'use strict';

  var TabView = Backbone.View.extend({

    template: Handlebars.compile(tpl),

    events: {
      'change .threshold' : 'changeThreshold',
      'change .start-date' : 'changeStartDate',
      'change .end-date' : 'changeEndDate',
      'change .section' : 'changeSection',
      'click .switcher-item' : 'changeUnit'
    },

    initialize: function(setup) {
      this.presenter = new TabPresenter(this, setup);
      this.widget = setup.widget;
      this.render();
    },

    /**
     * RENDER
     */
    render: function() {
      this.$el.html(this.template(this.parseData()));
      this.delegateEvents();
      this.cacheVars();
      this.setIndicator();
      this.setStatusValues();
      return this;
    },

    parseData: function() {
      return this.presenter.model.get('data')
    },

    cacheVars: function() {
      this.$start_date = this.$el.find('.start-date');
      this.$end_date = this.$el.find('.end-date');
      this.$date_selects = this.$el.find('.date-selector');
      this.$threshold = this.$el.find('.threshold');
      this.$switcher = this.$el.find('.switcher');
      this.$average = this.$el.find('.tab-average');

      this.$graphContainer = this.$el.find('.tab-graph');
    },

    // CHANGE EVENTS
    changeThreshold: function(e) {
      this.presenter.changeThreshold($(e.currentTarget).val());
    },

    changeUnit: function(e) {
      this.presenter.changeUnit($(e.currentTarget).data('unit'));
    },

    changeStartDate: function(e) {
      this.presenter.changeStartDate($(e.currentTarget).val());
    },

    changeEndDate: function(e) {
      this.presenter.changeEndDate($(e.currentTarget).val());
    },

    changeSection: function(e) {
      this.presenter.changeSection($(e.currentTarget).val());
    },


    // SETTERS
    setStatusValues: function() {
      var t = this.presenter.status.get('tabs');
      (!!t.start_date && !!t.end_date) ? this.setDates() : null;
      (!!t.thresh) ? this.$threshold.val(t.thresh) : null;
      (!!t.unit) ? this.$switcher.find('li[data-unit='+t.unit+ ']').addClass('is-active') : null;
    },

    // SETTERS: dates
    setDates: function() {
      this.$start_date.val(this.presenter.status.get('tabs').start_date);
      this.$end_date.val(this.presenter.status.get('tabs').end_date);
      this.toggleDisabledDates();
    },

    toggleDisabledDates: function(){
      _.each(this.$date_selects,_.bind(function(el){
        var $options = $(el).find('option');
        var compare = $(this.$el.find($(el).data('compare')))[0].selectedIndex;
        var direction = Boolean(parseInt($(el).data('direction')));

        _.each($options, function(opt,i){
          if (direction) {
            (compare <= i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          }else{
            (compare >= i) ? $(opt).prop('disabled',true) : $(opt).prop('disabled',false);
          }
        });
      }, this ));
    },

    // SETTERS: average
    setAverage: function(average) {
      var t = this.presenter.status.get('tabs');
      var txt = '';
      switch(t.unit) {
        case 'hectares':
          txt = d3.format(",.0f")(average) + ' ha';
        break;
        case 'percentage':
          txt = d3.format(".2%")(average);
        break;
        case 'tg-c':
          txt = d3.format(",.2f")(average) + ' tg-c';
        break;
        case 'mt-co2':
          txt = d3.format(",.2f")(average) + ' mt-co2';
        break
      }
      this.$average.html(txt);
    },

    // SETTERS: indicator
    setIndicator: function() {
      var t = this.presenter.status.get('tabs');
      switch(t.type) {
        case 'line':
          var indicator = _.findWhere(this.presenter.model.get('indicators'),{ unit: t.unit});
          new LineChartIndicator({
            el: this.$graphContainer,
            tab: this,
            className: 'is-line',
            model: {
              id: indicator.id,
              unit: t.unit,
              start_date: t.start_date,
              end_date: t.end_date,
              type: 'line',
              // Compare model params
              location_compare: this.presenter.model.get('location_compare'),
              slug_compare: this.presenter.model.get('slug_compare'),
            },
            data: {
              location: this.presenter.model.get('location'),
              thresh: t.thresh,
            }
          });
          break;

        case 'pie':
          var indicators = _.where(this.presenter.model.get('indicators'),{ section: t.section});
          new PieChartIndicator({
            el: this.$graphContainer,
            tab: this,
            className: 'is-pie',
            model: {
              indicators: indicators,
              section: t.section,
              sectionswitch: t.sectionswitch,
              template: 'biomass-carbon',
              type: 'pie',
            },
            data: {
              location: this.presenter.model.get('location'),
              thresh: t.thresh,
            }
          });
          break;

        case 'number':
          var indicator = _.findWhere(this.presenter.model.get('indicators'),{ tab: t.position})
          new NumberChartIndicator({
            el: this.$graphContainer,
            tab: this,
            className: 'is-number',
            model: {
              id: indicator.id,
              template: 'umd',
              type: 'number',
            },
            data: {
              location: this.presenter.model.get('location'),
              thresh: t.thresh,
            }
          });
          break;

      };

    },

  });

  return TabView;

});
