var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
};

PriceChart.prototype.MAX_SERIES = 69;
PriceChart.prototype.PRICE_CHART_WIDTH = 210; //in pixels
PriceChart.prototype.PRICE_CHART_TICK_WIDTH = 43; //in pixels
PriceChart.prototype.PRICE_CHART_HEIGHT = 240; //in pixels
PriceChart.prototype.POINT_HEIGHT = 3; //in pixels
PriceChart.prototype.LABEL_WIDTH = 3; //in pixels

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = this._createFreshPriceChartViewModel();
	$(this.containerId).text('');
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function() {
	var data = this.data.getData();
	var priceBound = data.priceBound;
	
	var yaxisOptions = {min : priceBound.minPrice, max : priceBound.maxPrice};	
	var yaxisBounds = this._getYAxisBounds(data.dataPoints[data.dataPoints.length -1], yaxisOptions);
	
	var ticks = this._prepareTicks(yaxisBounds);
	
	var chartGraphContainer = this._createDivElement("price-chart", "price-chart");
	var tickLabelsContainer = this._createDivElement("price-chart-ticks", "price-chart-ticks");
	$(this.containerId).append(chartGraphContainer);
	$(this.containerId).append(tickLabelsContainer);
	
	this._insertTicks(ticks, yaxisOptions, yaxisBounds);
	
	for (var i = 0; i < data.dataPoints.length; i++) {
        series = data.dataPoints[i];
        for (var j = 0; j < series.length; j++) {                    	
            this._drawpoint(series, series[j], series.color, data.dataPoints.length, yaxisBounds);
        }
    }
};

PriceChart.prototype.clearChart = function() {
	$(this.containerId).html("");
};


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

PriceChart.prototype._drawpoint = function(series, data, color, noOfSeries, yaxisBounds) {
    var x,y;
    var xCoord = this.PRICE_CHART_WIDTH - ((noOfSeries - data[0])*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(data[1], yaxisBounds) - 1.5;
    var point = this._createPoint(x, y, data[2], color, data[3]);
    $("#price-chart").append(point);
};

PriceChart.prototype._createPoint = function(x, y, alpha, color, isAskPoint) {
	var point = document.createElement('div');
	$(point).addClass("point");
	$(point).css("left", x+"px");
	$(point).css("top", y+"px");
	$(point).css("top", y+"px");
	var backgroundColor = isAskPoint ? "rgb(0, 0, 255)": "rgb(255, 0, 0)";
	$(point).css("backgroundColor", backgroundColor);
	$(point).fadeTo(0,alpha);
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price, yaxisBounds){
	return this.PRICE_CHART_HEIGHT - (this.PRICE_CHART_HEIGHT*((price - yaxisBounds.minY)/(yaxisBounds.maxY- yaxisBounds.minY)));
};

PriceChart.prototype._prepareTicks = function(yaxisBounds){
	var ticks = [];
	var tickDecimals = 5;
	var gap = yaxisBounds.maxY - yaxisBounds.minY;
	var noOfTicks = 10;
	var labelAvg = gap/noOfTicks;
	var value = yaxisBounds.maxY - labelAvg;
	for(i = 0; i < 9; i++) {
		ticks.push({value: value, label:value.toFixed(tickDecimals)})
		value -= labelAvg;
	}
	return ticks;
};

PriceChart.prototype._insertTicks = function(ticks, yaxisOptions, yaxisBounds){
	for (var i = 0; i < ticks.length; ++i) {
        var tick = ticks[i];
        var y = this._getYCoordinateFrom(tick.value, yaxisBounds);
        this._drawTickLabel(tick.label, y-5);
        this._drawLine(y, this.PRICE_CHART_WIDTH);
    }
};

PriceChart.prototype._drawTickLabel = function(label, y){
	var tickLabel = document.createElement('div');
	$(tickLabel).addClass("tick-label");
	$(tickLabel).css("top", y + "px");
	$(tickLabel).text(label);
	$("#price-chart-ticks").append(tickLabel);
};

PriceChart.prototype._drawLine = function(y, lineWidth){
	var line = document.createElement('div');
	$(line).addClass("line");
	$(line).css("top", y + "px");
	$(line).css("width", lineWidth + "px");
    $("#price-chart").append(line);
};

PriceChart.prototype._createDivElement = function(name, className) {
	var divElement = document.createElement('div');
	$(divElement).attr("id", name);
	$(divElement).addClass(className);
	return divElement;
};

