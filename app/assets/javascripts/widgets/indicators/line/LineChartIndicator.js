define([
  'd3',
  'moment',
  'underscore',
  'handlebars',
  'widgets/models/IndicatorModel',
  'widgets/views/IndicatorView',
  'widgets/indicators/line/LineChart',
  'text!widgets/templates/indicators/line/linechart.handlebars',
  'text!widgets/templates/indicators/no-data.handlebars',
], function(d3, moment, _, Handlebars, IndicatorModel, IndicatorView, LineChart, Tpl, noDataTpl) {

  'use strict';

  var LineChartIndicator = IndicatorView.extend({

    template: Handlebars.compile(Tpl),
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
      this.$el.addClass('is-loading');
      // Fetch both models if compare exists
      if (this.model.get('location_compare')) {
        // set data compare
        var dataCompare = _.extend({},data,{ location: this.model.get('location_compare')});

        $.when(this.model.fetch({ data: this.setFetchParams(data) }),this.modelCompare.fetch({ data: this.setFetchParams(dataCompare) })).done(function(){
          this.render();
          this.$el.removeClass('is-loading');
        }.bind(this));
      } else {
        // Fetch values
        this.model.fetch({ data: this.setFetchParams(data) }).done(function() {
          this.render();
          this.$el.removeClass('is-loading');
        }.bind(this));
      }

    },

    render: function() {
      this.$el.html(this.template());
      this._drawGraph();
    },

    _drawGraph: function() {
      var keys = { x: 'year', y: 'value' };
      var parseDate = d3.time.format("%Y").parse;
      var $graphContainer = this.$el.find('.linechart-graph')[0];
      var data = _.compact(_.map(this.model.get('data'), function(d) {
        if (d && d.year && Number(d.year !== 0) && this.between(d.year,this.model.get('start_date'),this.model.get('end_date'),true)) {
          return {
            year: parseDate(d.year.toString()),
            value: (!isNaN(d.value)) ? d.value : 0
          };
        }
        return null;
      }.bind(this)));


      if (!!data.length) {
        // Set range
        var arr = (this.model.get('location_compare')) ? _.union(this.model.get('data'), this.modelCompare.get('data')) : this.model.get('data');
        var range = [0, _.max(arr, function(o){return o.value;}).value];
        // var range = [_.min(arr, function(o){return o.value;}).value, _.max(arr, function(o){return o.value;}).value];
        var lineChart = new LineChart({
          id: this.model.get('id'),
          el: $graphContainer,
          unit: this.model.get('unit'),
          data: data,
          range: range,
          sizing: {top: 10, right: 10, bottom: 20, left: 0},
          innerPadding: { top: 10, right: 10, bottom: 20, left: 50 },
          keys: keys
        });
        lineChart.render();
        this.changeAverage(data);

      } else {
        this.$el.html(this.noDataTemplate({ classname: 'line'}));
      }
    },

    changeAverage: function(data) {
      var average = _.reduce(data, function(memo, num) {
        return memo + num.value;
      }, 0) / data.length;
      this.tab.setAverage(average);
    },

    between: function(num, a, b, inclusive) {
      var min = Math.min(a, b),
          max = Math.max(a, b);
      return inclusive ? num >= min && num <= max : num > min && num < max;
    }

  });

  return LineChartIndicator;

});
