var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
    this.chartRendered = false;
    this.priceChart =  null;
    this.priceChartTicks = null;
};

PriceChart.prototype.MAX_SERIES = 69;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	delete this.data;
	this.data = this._createFreshPriceChartViewModel();
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function(tickDecimals) {
	var chartFragment = document.createDocumentFragment();
	var chartDivTag = document.createElement('div');
	chartFragment.appendChild(chartDivTag);
	var data = this.data.getData();
	var lastSeriesData = data.dataPoints[data.dataPoints.length -1];
	this.yaxisBounds = this._getYaxisBounds(lastSeriesData);
	
	var ticks = this._prepareTicks(tickDecimals);
	this._insertTicks(ticks, chartDivTag);
	this._drawPoints(data.dataPoints, chartDivTag);

	this._getPriceChart().replaceChild(chartFragment, this._getPriceChart().firstChild);
	this.chartRendered = true;
};

PriceChart.prototype._getYaxisBounds = function(lastSeriesData){
	var bestPrices = this._getBestPrices(lastSeriesData);
	var averageBestPrice = (parseFloat(bestPrices.bestAskPrice) + parseFloat(bestPrices.bestBidPrice))/2;
	
	var spread = Math.abs(parseFloat(bestPrices.bestAskPrice) - parseFloat(bestPrices.bestBidPrice));
	if(spread == 0) {
		return this.yaxisBounds;
	}
	var spreadPoints = this._getSpreadPoints(bestPrices.bestAskPrice, bestPrices.bestBidPrice);
	var totalScale;

	if(spreadPoints < 10) {
		totalScale = (spread/(spreadPoints*10) * 100);
	} else {
		totalScale = (spread/spreadPoints * 100);
	}
	return {maxY : averageBestPrice + totalScale/2, minY : averageBestPrice - totalScale/2};
};

PriceChart.prototype._getBestPrices = function(series){
    for(var i = 0; i < series.length; i++){
    	var dataPoint = series[i];
    	if(dataPoint.isAskPoint == false){
    		var bestBidPrice = dataPoint.price;
    		var bestAskPrice = series[i-1].price;
    		return {bestAskPrice: bestAskPrice, bestBidPrice: bestBidPrice}; 
    	}
    }
};

PriceChart.prototype._drawPoint = function(dataPoint, color, noOfSeries, chartDivTag, bestPrices) {
	var priceChartWidth = $(this._getPriceChart()).width();
    var x,y;
    var xCoord = priceChartWidth - ((noOfSeries - dataPoint.seriesNumber)*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(parseFloat(dataPoint.price)) - 1.5;
    var point = this._createPoint(x, y, dataPoint, color, bestPrices);
    chartDivTag.appendChild(point);
};

PriceChart.prototype._createPoint = function(x, y, dataPoint, color, bestPrices) {
	var price = parseFloat(dataPoint.price);
	var point = document.createElement("div");
	$(point).addClass("point").css("left", x+"px").css("top", y+"px");
	var backgroundColor = null;
	if(dataPoint.isAskPoint) {
		backgroundColor = (price <= parseFloat(bestPrices.bestBidPrice)) ? "rgb(0, 192, 0)" : "rgb(0, 0, 255)";
	} else {
		backgroundColor = (price >= parseFloat(bestPrices.bestAskPrice)) ? "rgb(0, 192, 0)" :  "rgb(255, 0, 0)";
	}
	$(point).css("backgroundColor", backgroundColor).fadeTo(0, dataPoint.colorFactor);
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price){
	var priceChartHeight = $(this._getPriceChart()).height();
	return priceChartHeight - (priceChartHeight*((price - this.yaxisBounds.minY)/(this.yaxisBounds.maxY- this.yaxisBounds.minY)));
};

PriceChart.prototype._prepareTicks = function(tickDecimals){
	var ticks = [];
	var gap = this.yaxisBounds.maxY - this.yaxisBounds.minY;
	var noOfTicks = 10;
	var labelAvg = gap/noOfTicks;
	var value = this.yaxisBounds.maxY - labelAvg;
	for(i = 0; i < 9; i++) {
		ticks.push({value: value, label:value.toFixed(tickDecimals)})
		value -= labelAvg;
	}
	return ticks;
};

PriceChart.prototype._insertTicks = function(ticks, chartDivTag){
	var priceChartWidth = $(this._getPriceChart()).width();
	var chartTicksFragment = document.createDocumentFragment();
	var chartTicksDivTag = document.createElement("div");
	chartTicksFragment.appendChild(chartTicksDivTag);
	for (var i = 0; i < ticks.length; ++i) {
        var tick = ticks[i];
        var y = this._getYCoordinateFrom(tick.value);
        this._drawTickLabel(tick.label, y-5, i, chartTicksDivTag);
        this._drawLine(y, priceChartWidth, chartDivTag);
    }
	this._getPriceChartTicks().replaceChild(chartTicksFragment, this._getPriceChartTicks().firstChild);
};

PriceChart.prototype._drawTickLabel = function(label, y, index, chartTicksDivTag){
	var tickLabel = document.createElement("div");
	$(tickLabel).attr("id", "tickLabel" + index).addClass("tick-label").css("top", y + "px").text(label);
	chartTicksDivTag.appendChild(tickLabel);
};

PriceChart.prototype._drawLine = function(y, lineWidth, chartDivTag){
	var line = document.createElement("div");
	$(line).addClass("line").css("top", y + "px").css("width", lineWidth + "px");
	chartDivTag.appendChild(line);
};

PriceChart.prototype._getPriceChart = function() {
	if(!this.priceChart) {
		this.priceChart = document.getElementById("price-chart");
	}
	return this.priceChart;
};

PriceChart.prototype._getPriceChartTicks = function() {
	if(!this.priceChartTicks) {
		this.priceChartTicks = document.getElementById("price-chart-ticks");
	}
	return this.priceChartTicks;
};

PriceChart.prototype._drawPoints = function (dataPoints, chartDivTag) {
	for (var i = 0; i < dataPoints.length; i++) {
        series = dataPoints[i];
        var bestPrices = this._getBestPrices(series);
        for (var j = 0; j < series.length; j++) {   
        	var dataPoint = series[j];
        	var price = parseFloat(dataPoint.price);
        	if(this.yaxisBounds.minY <= price && price <= this.yaxisBounds.maxY) {
        		this._drawPoint(dataPoint, series.color, dataPoints.length, chartDivTag, bestPrices);
        	}
        }
    }
};

PriceChart.prototype._getSpreadPoints = function(bestAskPrice, bestBidPrice) {
	var dot = bestBidPrice !== null ? bestBidPrice.indexOf('.') : -1;
	var fixedPointPrecision = dot != -1 ? (bestBidPrice.length - dot - 1) : 0;
	var bestAskPriceInt = this._getInt(bestAskPrice, fixedPointPrecision);
	var bestBidPriceInt = this._getInt(bestBidPrice, fixedPointPrecision);
	var range =  Math.abs(bestAskPriceInt - bestBidPriceInt);
	if(range > 0) {
		var rangeStr = range.toString(); 
		var spreadPoints = rangeStr.substring(0, rangeStr.length - 1) + "." + rangeStr[rangeStr.length - 1];
		return parseFloat(spreadPoints);
	}
	return 0;
};

PriceChart.prototype._getInt = function(value, dp) {
	var point = value !== null ? value.indexOf('.') : -1;
	var intValue = dp == 0 ? parseInt(value, 10) : parseInt(value.substring(0, point) + value.substring(point + 1), 10);
	return intValue;
};

