var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
    this.width = null;
    this.height = null;
    this.yaxisBounds = null;
};

PriceChart.prototype.MAX_SERIES = 69;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	delete this.data.itsProperties;
	delete this.data;
	delete this.yaxisBounds;
	this.data = this._createFreshPriceChartViewModel();
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function(tickDecimals) {
	var data = this.data.getData();
	var lastSeriesData = data.dataPoints[data.dataPoints.length -1];
	this.yaxisBounds = this._getYaxisBounds(lastSeriesData);

	var ticks = this._prepareTicks(tickDecimals);
	var chartInnerHtml = new StringBuilder();
	
	this._createTicksAndLines(ticks, chartInnerHtml);
	this._drawPoints(data.dataPoints, chartInnerHtml);

	var chartFragment = document.createDocumentFragment();
	var chartDivTag = document.createElement('div');
	chartFragment.appendChild(chartDivTag);
	chartDivTag.innerHTML = chartInnerHtml.toString();

	this._getPriceChart().replaceChild(chartFragment, this._getPriceChart().firstChild);
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

PriceChart.prototype._drawPoint = function(dataPoint, color, noOfSeries, bestPrices) {
	var priceChartWidth = this._getWidth();
    var x,y;
    var xCoord = priceChartWidth - ((noOfSeries - dataPoint.seriesNumber)*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(parseFloat(dataPoint.price)) - 1.5;
    var point = this._createPoint(x, y, dataPoint, color, bestPrices);
    return point;
};

PriceChart.prototype._createPoint = function(x, y, dataPoint, color, bestPrices) {
	var price = parseFloat(dataPoint.price);
	var backgroundColor = null;
	if(dataPoint.isAskPoint) {
		backgroundColor = (price <= parseFloat(bestPrices.bestBidPrice)) ? "rgb(0, 192, 0)" : "rgb(0, 0, 255)";
	} else {
		backgroundColor = (price >= parseFloat(bestPrices.bestAskPrice)) ? "rgb(0, 192, 0)" :  "rgb(255, 0, 0)";
	}
	var style = new StringBuilder();
	style.append("left:" + x + "px;").append("top:" + y + "px;")
		 .append("background-color:" + backgroundColor + ";")
		 .append("opacity: " + dataPoint.colorFactor + ";")
		 .append("filter: alpha(opacity="+ dataPoint.colorFactor*100 + ")");
	var point = "<div class='point' style='" + style.toString() + "'></div>" 
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price){
	var priceChartHeight = this._getHeight();
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

PriceChart.prototype._createTicksAndLines = function(ticks, chartInnerHtml){
	var tickLabels = new StringBuilder();
	var priceChartWidth = this._getWidth();
	var chartTicksFragment = document.createDocumentFragment();
	var chartTicksDivTag = document.createElement("div");
	chartTicksFragment.appendChild(chartTicksDivTag);
	for (var i = 0; i < ticks.length; ++i) {
        var tick = ticks[i];
        var y = this._getYCoordinateFrom(tick.value);
        tickLabels.append(this._createTickLabel(tick.label, y-5, i));
        chartInnerHtml.append(this._createLine(y, priceChartWidth));
    }
	chartTicksDivTag.innerHTML = tickLabels.toString();
	this._getPriceChartTicks().replaceChild(chartTicksFragment, this._getPriceChartTicks().firstChild);
};

PriceChart.prototype._createTickLabel = function(label, y, index, chartTicksDivTag){
	var tickLabel = new StringBuilder();
	var tickLabel = "<div id='tickLabel"+ index +"' class='tick-label' style='top: "+ y +"px'>"+ label +"</div>";
	return tickLabel;
};

PriceChart.prototype._createLine = function(y, lineWidth, chartDivTag){
	var style = "top: " + y + "px; width: " + lineWidth + "px"; 
	var line = "<div class='line' style='" + style + "'></div>"
	return line;
};

PriceChart.prototype._getPriceChart = function() {
	return document.getElementById("price-chart");
};

PriceChart.prototype._getPriceChartTicks = function() {
	return document.getElementById("price-chart-ticks");
};

PriceChart.prototype._drawPoints = function (dataPoints, chartInnerHtml) {
	for (var i = 0; i < dataPoints.length; i++) {
        series = dataPoints[i];
        var bestPrices = this._getBestPrices(series);
        for (var j = 0; j < series.length; j++) {   
        	var dataPoint = series[j];
        	var price = parseFloat(dataPoint.price);
        	if(this.yaxisBounds.minY <= price && price <= this.yaxisBounds.maxY) {
        		chartInnerHtml.append(this._drawPoint(dataPoint, series.color, dataPoints.length, bestPrices));
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
		var spreadPoints = range/10;
		return parseFloat(spreadPoints);
	}
	return 0;
};

PriceChart.prototype._getInt = function(value, dp) {
	var point = value !== null ? value.indexOf('.') : -1;
	var intValue = dp == 0 ? parseInt(value, 10) : parseInt(value.substring(0, point) + value.substring(point + 1), 10);
	return intValue;
};

PriceChart.prototype._getWidth = function() {
	if(!this.width) {
		this.width =  $(this._getPriceChart()).width();
	}
	return this.width;
};

PriceChart.prototype._getHeight = function() {
	if(!this.height) {
		this.height =  $(this._getPriceChart()).height();
	}
	return this.height;
};

