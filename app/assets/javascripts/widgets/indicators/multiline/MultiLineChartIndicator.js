define([
  'd3',
  'moment',
  'underscore',
  'handlebars',
  'widgets/models/IndicatorModel',
  'widgets/views/IndicatorView',
  'widgets/indicators/multiline/MultiLineChart',
  'text!widgets/templates/indicators/line/linechart.handlebars',
  'text!widgets/templates/indicators/line/linechart-legend.handlebars',
  'text!widgets/templates/indicators/no-data.handlebars',
], function(d3, moment, _, Handlebars, IndicatorModel, IndicatorView, MultiLineChart, Tpl, legendTpl, noDataTpl) {

  'use strict';

  var LineChartIndicator = IndicatorView.extend({

    template: Handlebars.compile(Tpl),
    legendTemplate: Handlebars.compile(legendTpl),
    noDataTemplate: Handlebars.compile(noDataTpl),

    events: function() {
      return _.extend({}, IndicatorView.prototype.events, {});
    },

    initialize: function(setup) {
      this.constructor.__super__.initialize.apply(this, [setup]);

      this.tab = setup.tab;
      this.model = new IndicatorModel(setup.model);
      // Create model for compare indicator
      if(this.model.get('location_compare')) {
        this.modelCompare = new IndicatorModel(setup.model);
      }
      this.fetchIndicator(setup.data);
    },

    fetchIndicator: function(data) {
      // NEW
      var status = {
        promises: []
      };
      _.each(this.model.get('indicators'), _.bind(function(i) {
        var deferred = $.Deferred();
        new IndicatorModel({id: i.id})
            .fetch({
              data:this.setFetchParams(data)
            })
            .done(function(data){
              deferred.resolve(data);
            });
        status.promises.push(deferred);
      }, this))
      // Promises of each country resolved
      $.when.apply(null, status.promises).then(_.bind(function() {
        this.$el.removeClass('is-loading');
        var args = Array.prototype.slice.call(arguments);
        var values = _.groupBy(_.flatten(_.compact(_.map(args, function(i){
          return i.values;
        }))), 'indicator_id');
        var data = _.map(this.model.get('indicators'), function(i){
          i.data = values[i.id];
          return i;
        });
        this.model.set('data', data);
        this.render();
      }, this ));
    },

    render: function() {
      this.$el.html(this.template());
      this.cacheVars();
      this._drawGraph();
    },

    cacheVars: function() {
      this.$legend = this.$el.find('.linechart-legend');
    },

    _drawGraph: function() {
      var keys = { x: 'year', y: 'value' };
      var parseDate = d3.time.format("%Y").parse;
      var $graphContainer = this.$el.find('.linechart-graph')[0];
      var data = _.map(this.model.get('data'), function(l) {
        return _.compact(_.map(l.data,_.bind(function(d){
          if (d && d.year && Number(d.year !== 0) && this.between(d.year,this.model.get('start_date'),this.model.get('end_date'),true)) {
            return {
              year: parseDate(d.year.toString()),
              value: (!isNaN(d.value)) ? d.value : 0
            };
          }
          return null;
        }, this )))
      }.bind(this));

      // Set range
      var rangeX = [_.min(_.map(data, function(d) { return _.min(d, function(o){return o.year;}).year})), _.max(_.map(data, function(d) { return _.max(d, function(o){return o.year;}).year})) ] ;
      var rangeY = [_.min(_.map(data, function(d) { return _.min(d, function(o){return o.value;}).value})), _.max(_.map(data, function(d) { return _.max(d, function(o){return o.value;}).value})) ] ;

      // Initialize Line Chart
      this.chart = new MultiLineChart({
        parent: this,
        el: $graphContainer,
        id: this.model.get('id'),
        data: data,
        indicators: this.model.get('indicators'),
        unit: this.model.get('unit'),
        unitname: this.model.get('unitname'),
        rangeX: rangeX,
        rangeY: rangeY,
        slug: this.model.get('slug'),
        slug_compare: this.model.get('slug_compare'),
        sizing: {top: 10, right: 10, bottom: 20, left: 0},
        innerPadding: { top: 15, right: 10, bottom: 20, left: 50 },
        keys: keys
      });
      this.chart.render();
    },

    _drawAverage: function(averages) {
      this.tab.setAverage(averages);
    },

    _drawLegend: function(legend) {
      this.$legend.html(this.legendTemplate({ legend: legend }));
    },

    between: function(num, a, b, inclusive) {
      var min = Math.min(a, b),
          max = Math.max(a, b);
      return inclusive ? num >= min && num <= max : num > min && num < max;
    },

    destroy: function() {
      if (this.chart) {
       this.chart.destroy();
       this.chart = null;
      }
    },

    resize: function(){
      console.log('hello');
    }

  });

  return LineChartIndicator;

});
