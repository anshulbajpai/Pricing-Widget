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
	
	var yAxisOptions = {min : priceBound.minPrice, max : priceBound.maxPrice};	
	var yAxisBounds = this._getYAxisBounds(data.dataPoints[data.dataPoints.length -1], yAxisOptions); 
	
	for (var i = 0; i < data.dataPoints.length; i++) {
        series = data.dataPoints[i];
        for (var j = 0; j < series.length; j++) {                    	
            this._drawpoint(series, series[j], series.color, data.dataPoints.length, yAxisBounds);
        }
    }
};

PriceChart.prototype.clearChart = function() {
	$("#price-chart").html("");
}


PriceChart.prototype._getYAxisBounds = function(lastSeriesData, yAxisOptions){
    var averageBestPrice = this._getAverageOverBestPrice(lastSeriesData);
    var allSeriesMinPrice = yAxisOptions.min
    var allSeriesMaxPrice = yAxisOptions.max;  
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
	point.style.backgroundColor = isAskPoint ? "rgba(255, 0, 0, " + alpha + ")" : "rgba(0, 0, 255, " + alpha + ")";
	return point;
};

PriceChart.prototype._getYCoordinateFrom = function(price, yAxisBounds){
	return 270 - (270*((price - yAxisBounds.minY)/(yAxisBounds.maxY- yAxisBounds.minY)));
};


