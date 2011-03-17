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
        ctx.fillStyle = isAskPoint ? "rgba(255, 0, 0, " + alpha + ")" : "rgba(0, 0, 255, " + alpha + ")";
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
           }
        }

        function draw(plot, ctx) {
            var series;
            canvas = plot.getCanvas();
            target = $(canvas).parent();
            axes = plot.getAxes();
            offset = plot.getPlotOffset();
            data = plot.getData();
            
            var yAxisOptions = plot.getOptions().yaxis;
            var yAxisBounds = getYAxisBounds(data[data.length -1].data, yAxisOptions); 
            yAxisOptions = {min : yAxisBounds.minY, max : yAxisBounds.maxY};
            
            function getYCoordinateFrom(price){
            	return plot.height()*((price - yAxisBounds.minY)/(yAxisBounds.maxY- yAxisBounds.minY));
            }            
            
            for (var i = 0; i < data.length; i++) {
                series = data[i];
                if (series.map.show) {
                    for (var j = 0; j < series.data.length; j++) {                    	
                        drawpoint(ctx, series, series.data[j], getYCoordinateFrom, series.color, data.length);
                    }
                }
            }
        }
        
        function getYAxisBounds(lastSeriesData, yAxisOptions){
            var averageBestPrice = getAverageOverBestPrice(lastSeriesData);
            var allSeriesMinPrice = yAxisOptions.min
            var allSeriesMaxPrice = yAxisOptions.max;  
            var bidGap = averageBestPrice - allSeriesMinPrice;
            var askGap = allSeriesMaxPrice - averageBestPrice;
            var gap = askGap > bidGap ?  askGap : bidGap;
            var maxY = averageBestPrice + gap;
            var minY = averageBestPrice - gap;
            return {maxY : maxY, minY : minY}
        }
        
        function getAverageOverBestPrice(series){
            for(var i = 0; i < series.length; i++){
            	if(series[i][3] == false){
            		var bestBidPrice = series[i][1];
            		var bestAskPrice = series[i-1][1];
            		return ( bestAskPrice +  bestBidPrice)/2
            	}
            }
        }

        function drawpoint(ctx, series, data, getYCoordinateFrom, color, noOfSeries) {
            var x,y;
            var xCoord = plot.width() - ((noOfSeries - data[0])*series.map.pointDimension) ;
            x = offset.left + xCoord;
            y = offset.top + getYCoordinateFrom(data[1]);
            if(x > offset.left){
	            series.map.drawpoint(ctx, series, x, y, data[2], color, data[3]);
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