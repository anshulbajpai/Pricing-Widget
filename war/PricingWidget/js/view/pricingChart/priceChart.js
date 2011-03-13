var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 3, active: true, show: true}}, xaxis : {noTicks : true}};	
};

PriceChart.prototype.MAX_SERIES = 105;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = this._createFreshPriceChartViewModel();
};

PriceChart.prototype._createFreshPriceChartViewModel = function(){
	return new PriceChartViewModel(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function() {
	var data = this.data.getData();
	var priceBound = data.priceBound;
	this.options.yaxis = {min : priceBound.minPrice, max : priceBound.maxPrice};
	$.plot($(this.containerId),data.dataPoints , this.options);
};