var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
    this.chartRendered = false;
};

PriceChart.prototype.MAX_SERIES = 69;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = this._createFreshPriceChartViewModel();
	this.clearChart();
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function(tickDecimals) {
	var data = this.data.getData();
	var yaxisBounds = this._getYaxisBounds(data.dataPoints[data.dataPoints.length -1]);
	
	var ticks = this._prepareTicks(yaxisBounds, tickDecimals);
	
	if(!this.chartRendered) {
		var chartGraphContainer = this._createDivElement("price-chart", "price-chart");
		var tickLabelsContainer = this._createDivElement("price-chart-ticks", "price-chart-ticks");
		$(this.containerId).append(chartGraphContainer);
		$(this.containerId).append(tickLabelsContainer);
	}
	
	this._insertTicks(ticks, yaxisBounds);
	
	for (var i = 0; i < data.dataPoints.length; i++) {
        series = data.dataPoints[i];
        for (var j = 0; j < series.length; j++) {   
        	var price = series[j][1];
        	if(yaxisBounds.minY <= price && price <= yaxisBounds.maxY) {
        		this._drawPoint(series[j], series.color, data.dataPoints.length, yaxisBounds);
        	}
        }
    }
	this.chartRendered = true;
};

PriceChart.prototype.clearChart = function() {
	$('.point').remove();
};

PriceChart.prototype._getYaxisBounds = function(lastSeriesData){
	var bestPrices = this._getBestPrices(lastSeriesData);
	var spread = bestPrices.bestAskPrice - bestPrices.bestBidPrice;
	var averageBestPrice = (bestPrices.bestAskPrice + bestPrices.bestBidPrice)/2;
	var totalScale = ((spread)/10 * 100);
	return {maxY : averageBestPrice + totalScale/2, minY : averageBestPrice - totalScale/2}
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

PriceChart.prototype._drawPoint = function(data, color, noOfSeries, yaxisBounds) {
	var priceChartWidthPx = this._getPriceChart().css("width");
	var priceChartWidth = this._getPixcelNumber(priceChartWidthPx);
    var x,y;
    var xCoord = priceChartWidth - ((noOfSeries - data[0])*3) ;
    x = xCoord;
    y = this._getYCoordinateFrom(data[1], yaxisBounds) - 1.5;
    var point = this._createPoint(x, y, data[2], color, data[3]);
    this._getPriceChart().append(point);
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
	var priceChartHeightPx = this._getPriceChart().css("height");
	var priceChartHeight = this._getPixcelNumber(priceChartHeightPx);
   
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

PriceChart.prototype._insertTicks = function(ticks, yaxisBounds){
	var priceChartWidthPx = this._getPriceChart().css("width");
	var priceChartWidth = this._getPixcelNumber(priceChartWidthPx);
	for (var i = 0; i < ticks.length; ++i) {
        var tick = ticks[i];
        var y = this._getYCoordinateFrom(tick.value, yaxisBounds);
        this._drawTickLabel(tick.label, y-5, i);
        if(!this.chartRendered) {
        	this._drawLine(y, priceChartWidth);
        }
    }
};

PriceChart.prototype._drawTickLabel = function(label, y, index){
	if(!this.chartRendered) {
		var tickLabel = document.createElement('div');
		$(tickLabel).attr("id", "tickLabel" + index);
		$(tickLabel).addClass("tick-label");
		$(tickLabel).css("top", y + "px");
		$(tickLabel).text(label);
	} else {
		$("#tickLabel" + index).text(label);
	}
	$("#price-chart-ticks").append(tickLabel);
};

PriceChart.prototype._drawLine = function(y, lineWidth){
	var line = document.createElement('div');
	$(line).addClass("line");
	$(line).css("top", y + "px");
	$(line).css("width", lineWidth + "px");
    this._getPriceChart().append(line);
};

PriceChart.prototype._createDivElement = function(name, className) {
	var divElement = document.createElement('div');
	$(divElement).attr("id", name);
	$(divElement).addClass(className);
	return divElement;
};

PriceChart.prototype._getPriceChart = function() {
	return $("#price-chart");
};

PriceChart.prototype._getPixcelNumber = function(pixcel) {
	return pixcel.split("px")[0];
};


