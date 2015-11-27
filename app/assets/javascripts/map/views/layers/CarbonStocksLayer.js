/**
 * The Carbonstocks layer module for use on canvas.
 *
 * @return CarbonstocksLayer class (extends ImageLayerClass)
 */
define([
  'd3',
  'uri',
  'abstract/layer/CanvasLayerClass',
  'map/presenters/layers/Forest2000LayerPresenter'
], function(d3,UriTemplate, CanvasLayerClass, Presenter) {

  'use strict';

  var CarbonstocksLayer = CanvasLayerClass.extend({

    options: {
      threshold: 30,
      dataMaxZoom: 12,
      urlTemplate: 'http://storage.googleapis.com/earthenginepartners-wri/whrc-hansen-carbon-{threshold}-{z}{/x}{/y}.png'
    },
  init: function(layer, options, map) {
      this.presenter = new Presenter(this);
      this._super(layer, options, map);
      this.threshold = options.threshold || this.options.threshold;
    },

    /**
     * Filters the canvas imgdata.
     * @override
     */
    filterCanvasImgdata: function(imgdata, w, h) {
    var components = 4;
    var zoom = this.map.getZoom();
    var exp = zoom < 11 ? 0.3 + ((zoom - 3) / 20) : 1;

    var myscale = d3.scale.pow()
          .exponent(exp)
          .domain([0,256])
          .range([0,256]);

    for(var i=0; i < w; ++i) {
      for(var j=0; j < h; ++j) {
        var pixelPos = (j*w + i) * components;
        var intensity = imgdata[pixelPos+3];

        imgdata[pixelPos] = 240;
        imgdata[pixelPos + 1] = 120;
        imgdata[pixelPos + 2] = 61;

        // apply intensity-dependent saturation on R & B channels
        //imgdata[pixelPos ] = (72 - zoom) + 151 - (3 * myscale(intensity) / zoom);
        //imgdata[pixelPos + 2] = (33 - zoom) + 61 - ((intensity) / zoom);

        // if (zoom < 13) {
        //   imgdata[pixelPos+ 3] = intensity*0.8;
        // } else {
        //   imgdata[pixelPos+ 3] = intensity*0.8;
        // }

        imgdata[pixelPos + 3] = zoom < 13 ? myscale(intensity)*0.8 : intensity*0.8;
      }
    }
    },

    setThreshold: function(threshold) {
      this.threshold = threshold;
      this.presenter.updateLayer();
    },

    _getUrl: function(x, y, z) {
      return new UriTemplate(this.options.urlTemplate)
        .fillFromObject({x: x, y: y, z: z, threshold: this.threshold});
    }

  });

  return CarbonstocksLayer;

});
