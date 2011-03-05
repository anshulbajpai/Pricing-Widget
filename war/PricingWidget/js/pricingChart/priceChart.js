var PriceChart = function (containerId) {
    this.data = new PriceChartData();
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 5, active: true, show: true}}};	
};

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	this.data.insert(seriesNumber, pointId, dataPoint);
};
	
PriceChart.prototype.reset = function(){
	this.data = new PriceChartData();
};

PriceChart.prototype.drawChart = function() {	
	this.options.yaxis = {min : this.data.getMin(), max : this.data.getMax()};
	$.plot($(this.containerId), this.data.getData(), this.options);
};







