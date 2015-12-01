define(['d3'], function(d3) {

  var barsChart = function(params) {
    var elem = params.elem;
    var elemAttr = elem.replace(/[#]|[.]/g, '');
    var $el = $(elem)
    var contentWidth = $el.width();
    var contentHeight = $el.height();
    var data = params.data;
    var hover = true;
    var loader = params.loader || null;
    var infoWindow = params.infoWindowText || '';
    var decimals = params.decimals || 0;
    var unit = params.unit || ''; 
    var unitZ = params.unitZ || ''; 
    var barWidth = params.barWidth || 10;
    var barSeparation = params.barSeparation || 10;
    var xIsDate = params.xIsDate || false;
    var hasLine = params.hasLine || false;
    var interpolate = params.interpolate || 'linear';
    var transition = 200;
    var margin = params.margin || {
      top: 0,
      right: 0,
      bottom: 80,
      left: 0,
      xaxis: 10,
      tooltip: 1.8
    };

    var width = contentWidth,
        height = contentHeight;

    var width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom;
    var heightPadding = height - 50;

    var totalBarsWidth = ((barWidth + barSeparation) * data.length) - barSeparation;
    var centerContainer = (contentWidth / 2) - (totalBarsWidth / 2);

    if(xIsDate) {
      data.forEach(function(d) {
        d.date = parseDate(d.date);
      });
    }

    if(hasLine) {
      var line = d3.svg.line()
        .x(function(d, i) { 
          return (barWidth+barSeparation) * i;
        })
        .y(function(d) { return y(d.z); })
        .interpolate(interpolate);
    }

    var svgBars = d3.select(elem).append('svg')
      .attr('class', '')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .4);

    var x2 = d3.scale.ordinal()
      .rangeBands([0, width], 0);

    x.domain(data.map(function(d) { return d.x; }));
    x2.domain(data.map(function(d) { return d.x; }));

    var yMin = d3.min(data, function(d){ return d.y; });
    var yMax = d3.max(data, function(d) { return d.y; });

    if (hasLine) { 
      var zMin = d3.min(data,function(d){ return d.z; });
      var zMax = d3.max(data, function(d) { return d.z; });
    }

    var y = d3.scale.linear()
      .domain([yMin, yMax])
      .range([height,yMin]).nice();

    if(hasLine) {
      var zMax = d3.max(data, function(d) { return d.z; });
      var z = d3.scale.linear()
        .domain([zMin, zMax])
        .range([height,0]).nice();
     
      var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([height,0]).nice();
    }

   var line = d3.svg.line()
     .x(function(d, i) { 
       return x2(d.x) + i; })
     .y(function(d) { return z(d.z); })
     .interpolate(interpolate);

    svgBars.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .style('fill', function(d) { return d.color; })
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand()) 
        .attr("y", function(d) { return y(Math.max(0, d.y)); })
        .attr("height", function(d) { return yMin >= 0 ? Math.abs(height - y(d.y)) : Math.abs(y(d.y) - y(0)); })
    
    if(hasLine) {

      svgBars.append('g')
        .attr('class', 'unit z')
        .attr('x', function(d) { return 0 })
        .attr('y', '-10')
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .text(function(d) { return unitZ; });

      svgBars.append('g')
        .attr('transform', function(d,i) {
          return 'translate(' + ((barWidth) / 2) + ', 0)';
        }).append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('stroke', function(d) { return d.lineColor })
          .attr('d', line); 
    }

    //Toolttio year
    var tooltipEl = elem+'-tooltip';
    var tooltip = d3.select(elem)
      .insert('div', 'svg')
        .attr('id', elemAttr+'-tooltip')
        .attr('class', 'tooltip-graph')

    tooltip.append('span')
      .attr('class', 'tooltip-year');

    var tooltipYear = d3.select(tooltipEl)
      .select('.tooltip-year');

    //legend
    var legendEl = elem+'-legend';
    var legend = d3.select(elem)
      .insert('div', 'svg')
        .attr('id', elemAttr+'-legend')
        .attr('class', 'graph-legend');

    var legendcontent1 = legend.append('div')
                          .attr('class', 'tree-cover-loss');

    legendcontent1.append('p').html('Tree cover loss');
    legendcontent1.append('span').attr('class', 'unit').html('Ha');
    legendcontent1.append('span').attr('class', 'tree-cover-loss-value');

    var legendcontent2 = legend.append('div')
                          .attr('class', 'gross-carbon-emissions');

    legendcontent2.append('p').html('Gross carbon emissions');
    legendcontent2.append('span').attr('class', 'unit').html('TCO2');
    legendcontent2.append('span').attr('class', 'gross-carbon-emissions-value');

    d3.selectAll(elem+' .bar').on('mousemove', function (d) {
      //Legend values
      d3.select(legendEl)
        .select('.tree-cover-loss-value')
        .text(parseFloat(d.z).toFixed(2))

      d3.select(legendEl)
       .select('.gross-carbon-emissions-value')
       .text(parseFloat(d.y).toFixed(2))

      //Tooltip year
      var element = d3.select(elem+' svg');
      var cords = d3.mouse(element.node());

      d3.select(tooltipEl)
        .style('left', ( cords[0] + 'px'))
        .style('display', 'block');

      d3.select(tooltipEl)
        .select('.tooltip-year')
        .text(d.x);
    });

    d3.selectAll(elem+' .bar').on('mouseout', function () {
        d3.select(tooltipEl)
          .style('display', 'none');
    });
  };

return barsChart;

});
