var PriceChart = function (containerId) {
    this.data = new PriceChartData(this.MAX_SERIES);
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 3, active: true, show: true}}, xaxis : {noTicks : true}};	
};

PriceChart.prototype.MAX_SERIES = 105;

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = new PriceChartData(this.MAX_SERIES);
};

PriceChart.prototype.drawChart = function() {
	var priceBound = this.data.getPriceBound();
	this.options.yaxis = {min : priceBound.min, max : priceBound.max};
	$.plot($(this.containerId), this.data.getData(), this.options);
};