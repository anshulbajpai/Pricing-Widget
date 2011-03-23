var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 3, active: true, show: true}}, xaxis : {noTicks : true}, yaxis : {noTicks : true}, grid : {aboveData : true}};
	this.plot = null;
};

PriceChart.prototype.MAX_SERIES = 67;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = this._createFreshPriceChartViewModel();
	$(this.containerId).text('');
	this.plot = null;
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function() {
	var data = this.data.getData();
	var priceBound = data.priceBound;
	
	var yaxisOptions = {min : priceBound.minPrice, max : priceBound.maxPrice};	
	var yAxisBounds = this._getYAxisBounds(data.dataPoints[data.dataPoints.length -1], yaxisOptions);
	
	this._prepareTicks(yaxisOptions);
	this._setTicks(yaxisOptions);
	
	for (var i = 0; i < data.dataPoints.length; i++) {
        series = data.dataPoints[i];
        for (var j = 0; j < series.length; j++) {                    	
            this._drawpoint(series, series[j], series.color, data.dataPoints.length, yAxisBounds);
        }
    }
};

//PriceChart.prototype.drawChart = function() {
//	var data = this.data.getData();
//	var priceBound = data.priceBound;
//	
//	this.options.y2axis = {min : priceBound.minPrice, max : priceBound.maxPrice};	
//	if(!this.plot)
//		this.plot = $.plot($(this.containerId),data.dataPoints , this.options);
//	else{
//		this.plot.getOptions().y2axis = this.options.y2axis;
//		this.plot.setData(data.dataPoints);
//		this.plot.setupGrid();
//		this.plot.draw();		
//	}
//};

PriceChart.prototype.clearChart = function() {
	$("#price-chart").html("");
}


PriceChart.prototype._getYAxisBounds = function(lastSeriesData, yaxisOptions){
    var averageBestPrice = this._getAverageOverBestPrice(lastSeriesData);
    var allSeriesMinPrice = yaxisOptions.min
    var allSeriesMaxPrice = yaxisOptions.max;  
    var bidGap = averageBestPrice - allSeriesMinPrice;
    var askGap = allSeriesMaxPrice - averageBestPrice;
    var gap = askGap > bidGap ?  askGap : bidGap;
    var maxY = averageBestPrice + gap;
    var minY = averageBestPrice - gap;
    return {maxY : maxY, minY : minY}
};

PriceChart.prototype._getAverageOverBestPrice = function(series){
    for(var i = 0; i < series.length; i++){
    	if(series[i][3] == false){
    		var bestBidPrice = series[i][1];
    		var bestAskPrice = series[i-1][1];
    		return ( bestAskPrice +  bestBidPrice)/2
    	}
    }
};

PriceChart.prototype._drawpoint = function(series, data, color, noOfSeries, yAxisBounds) {
    var x,y;
    var xCoord = 204 - ((noOfSeries - data[0])*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(data[1], yAxisBounds);
    var point = this._createPoint(x, y, data[2], color, data[3]);
    $("#price-chart").append(point);
};

PriceChart.prototype._createPoint = function(x, y, alpha, color, isAskPoint) {
	var point = document.createElement('div');
	point.className = "point";
	point.style.left = x+"px";
	point.style.top = y+"px";
	point.style.backgroundColor = isAskPoint ? "rgb(255, 0, 0)" : "rgb(0, 0, 255)";
	$(point).fadeTo(0,alpha);
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price, yAxisBounds){
	return 270 - (270*((price - yAxisBounds.minY)/(yAxisBounds.maxY- yAxisBounds.minY)));
};

PriceChart.prototype._prepareTicks = function(yaxisOptions){
	var chartHeight = 270;
	var noTicks = 0.3 * Math.sqrt(chartHeight);
	var delta = (yaxisOptions.max - yaxisOptions.min) / noTicks;
	var dec = -Math.floor(Math.log(delta) / Math.LN10);
	var magn = Math.pow(10, -dec);
	norm = delta / magn; 
	
	if (norm < 1.5)
        size = 1;
    else if (norm < 3) {
        size = 2;
        // special case for 2.5, requires an extra decimal
        if (norm > 2.25 && (maxDec == null || dec + 1 <= maxDec)) {
            size = 2.5;
            ++dec;
        }
    }
    else if (norm < 7.5)
        size = 5;
    else
        size = 10;

    size *= magn;
    yaxisOptions.tickDecimals = dec;
    
    generator = function (axis) {
        var ticks = [];

        // spew out all possible ticks
        var start =  axis.tickSize * Math.floor(axis.min / axis.tickSize);
        var   i = 0, v = Number.NaN, prev;
        do {
            prev = v;
            v = start + i * axis.tickSize;
            ticks.push({ v: v, label: axis.tickFormatter(v, axis) });
            ++i;
        } while (v < axis.max && v != prev);
        return ticks;
    };

    formatter = function (v, axis) {
        return v.toFixed(axis.tickDecimals);
    };
    
    yaxisOptions.tickSize = size;
    yaxisOptions.tickGenerator = generator;
    yaxisOptions.tickFormatter = formatter;
};

PriceChart.prototype._setTicks = function(yaxisOptions) {
    var yaxis = {};
	yaxis.ticks = [];

	yaxis.ticks = yaxisOptions.tickGenerator(yaxisOptions);
    return yaxis;
};

PriceChart.prototype._floorInBase = function(n, base) {
    return base * Math.floor(n / base);
};




