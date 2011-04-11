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
	var yaxisBounds = this._getYaxisBounds(lastSeriesData);
	
	var ticks = this._prepareTicks(yaxisBounds, tickDecimals);
	this._insertTicks(ticks, yaxisBounds, chartDivTag);
	this._drawPoints(data.dataPoints, yaxisBounds, chartDivTag);

	this._getPriceChart().replaceChild(chartFragment, this._getPriceChart().firstChild);
	this.chartRendered = true;
};

PriceChart.prototype._getYaxisBounds = function(lastSeriesData){
	var bestPrices = this._getBestPrices(lastSeriesData);
	var spread = bestPrices.bestAskPrice - bestPrices.bestBidPrice;
	var averageBestPrice = (bestPrices.bestAskPrice + bestPrices.bestBidPrice)/2;
	
	if(spread > 0) {
		var totalScale = ((spread)/10 * 100);
		return {maxY : averageBestPrice + totalScale/2, minY : averageBestPrice - totalScale/2};
	} 
	var max = lastSeriesData[0][1];
	var min = lastSeriesData[lastSeriesData.length-1][1];
	var maxGap = max - averageBestPrice;
	var minGap = averageBestPrice - min;
	var gap = maxGap > minGap ? maxGap: minGap; 
	return {maxY : averageBestPrice + gap, minY :  averageBestPrice - gap};
};

PriceChart.prototype._getBestPrices = function(series){
    for(var i = 0; i < series.length; i++){
    	if(series[i][3] == false){
    		var bestBidPrice = series[i][1];
    		var bestAskPrice = series[i-1][1];
    		return {bestAskPrice: bestAskPrice, bestBidPrice: bestBidPrice}; 
    	}
    }
};

PriceChart.prototype._drawPoint = function(data, color, noOfSeries, yaxisBounds, chartDivTag, bestPrices) {
	var priceChartWidth = $(this._getPriceChart()).width();
    var x,y;
    var xCoord = priceChartWidth - ((noOfSeries - data[0])*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(data[1], yaxisBounds) - 1.5;
    var point = this._createPoint(x, y, data, color, bestPrices);
    chartDivTag.appendChild(point);
};

PriceChart.prototype._createPoint = function(x, y, data, color, bestPrices) {
	var price = data[1];
	var alpha = data[2];
	var isAskPoint = data[3];
	var point = document.createElement("div");
	$(point).addClass("point").css("left", x+"px").css("top", y+"px");
	var backgroundColor = null;
	if(isAskPoint) {
		backgroundColor = (price <= bestPrices.bestBidPrice) ? "rgb(0, 192, 0)" : "rgb(0, 0, 255)";
	} else {
		backgroundColor = (price >= bestPrices.bestAskPrice) ? "rgb(0, 192, 0)" :  "rgb(255, 0, 0)";
	}
	$(point).css("backgroundColor", backgroundColor).fadeTo(0,alpha);
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price, yaxisBounds){
	var priceChartHeight = $(this._getPriceChart()).height();
	return priceChartHeight - (priceChartHeight*((price - yaxisBounds.minY)/(yaxisBounds.maxY- yaxisBounds.minY)));
};

PriceChart.prototype._prepareTicks = function(yaxisBounds, tickDecimals){
	var ticks = [];
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

PriceChart.prototype._insertTicks = function(ticks, yaxisBounds, chartDivTag){
	var priceChartWidth = $(this._getPriceChart()).width();
	var chartTicksFragment = document.createDocumentFragment();
	var chartTicksDivTag = document.createElement("div");
	chartTicksFragment.appendChild(chartTicksDivTag);
	for (var i = 0; i < ticks.length; ++i) {
        var tick = ticks[i];
        var y = this._getYCoordinateFrom(tick.value, yaxisBounds);
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

PriceChart.prototype._drawPoints = function (dataPoints, yaxisBounds, chartDivTag) {
	for (var i = 0; i < dataPoints.length; i++) {
        series = dataPoints[i];
        var bestPrices = this._getBestPrices(series);
        for (var j = 0; j < series.length; j++) {   
        	var price = series[j][1];
        	if(yaxisBounds.minY <= price && price <= yaxisBounds.maxY) {
        		this._drawPoint(series[j], series.color, dataPoints.length, yaxisBounds, chartDivTag, bestPrices);
        	}
        }
    }
};


