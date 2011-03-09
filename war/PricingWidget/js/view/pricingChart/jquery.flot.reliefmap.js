(function ($) {
    var options = {
        series: {
            map: {
                active: false,
                show: false,
                fill: true,
                pointDimension: 5,
                lineWidth: 2,
                highlight: { opacity: 0.5 },
                drawpoint: drawPointDefault
            }
        }
    };
    var data = null, canvas = null, target = null, axes = null, offset = null, highlights = [];

    function drawPointDefault(ctx, series, x, y, alpha, color, isAskPoint) {
        ctx.fillStyle = isAskPoint ? "rgba(255, 0, 0, " + alpha + ")" : "rgba(0, 0, 2255, " + alpha + ")";
        ctx.strokeStyle = color;
        ctx.lineWidth = series.map.lineWidth;

        ctx.beginPath();
        ctx.fillRect(x, y, series.map.pointDimension, series.map.pointDimension);
        ctx.closePath();

        if (series.map.fill) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    }

    function init(plot) {
        plot.hooks.processOptions.push(processOptions);

        function processOptions(plot, options) {
            if (options.series.map.active) {
                plot.hooks.draw.push(draw);
                plot.hooks.bindEvents.push(bindEvents);
                plot.hooks.drawOverlay.push(drawOverlay);
            }
        }

        function draw(plot, ctx) {
            var series;
            canvas = plot.getCanvas();
            target = $(canvas).parent();
            axes = plot.getAxes();
            offset = plot.getPlotOffset();
            data = plot.getData();
            for (var i = 0; i < data.length; i++) {
                series = data[i];
                if (series.map.show) {
                    for (var j = 0; j < series.data.length; j++) {
                        drawpoint(ctx, series, series.data[j], series.color, data.length);
                    }
                }
            }
        }

        function drawpoint(ctx, series, data, color, noOfSeries) {
            var x,y;
            var xCoord = plot.width() - ((noOfSeries - data[0])*series.map.pointDimension) ;
            x = offset.left + xCoord;
            if(x > offset.left){
	            y = offset.top + axes.yaxis.p2c(data[1]);
	            series.map.drawpoint(ctx, series, x, y, data[2], color, data[3]);
	        }
        }

        function bindEvents(plot, eventHolder) {
            var r = null;
            var options = plot.getOptions();
            var hl = new HighLighting(plot, eventHolder, findNearby, options.series.map.active, highlights)
        }

        function findNearby(plot, mousex, mousey) {
            var series, r;
            axes = plot.getAxes();
            for (var i = 0; i < data.length; i++) {
                series = data[i];
                if (series.map.show) {
                    for (var j = 0; j < series.data.length; j++) {
                        var dataitem = series.data[j];
                        var dx = Math.abs(axes.xaxis.p2c(dataitem[0]) - mousex)
                                , dy = Math.abs(axes.yaxis.p2c(dataitem[1]) - mousey)
                                , dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist <= dataitem[2]) {
                            r = {i: i,j: j};
                        }
                    }
                }
            }
            return r;
        }

        function drawOverlay(plot, octx) {
            octx.save();
            octx.clearRect(0, 0, target.width, target.height);
            for (i = 0; i < highlights.length; ++i) {
                drawHighlight(highlights[i]);
            }
            octx.restore();
            function drawHighlight(s) {
                var c = "rgba(255, 255, 255, " + s.series.bubbles.highlight.opacity + ")";
                drawpoint(octx, s.series, s.point, c, true);
            }
        }
    }

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'reliefmap',
        version: '0.1'
    });
})(jQuery);