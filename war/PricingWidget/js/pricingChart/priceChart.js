var PriceChart = function (containerId) {
    this.data = [];
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 5, active: true, show: true}}};
};

PriceChart.prototype.setDataPoint = function(seriesNumber, pointId, dataPoint) {
	if(this.data[seriesNumber] == null)
		this.data[seriesNumber] = [];
	if(this.data[seriesNumber][pointId] == null)	
		this.data[seriesNumber].push(dataPoint);
	else{
		this.data[seriesNumber].shift();
		this.data[seriesNumber].push(dataPoint);
	}	
};
	
PriceChart.prototype.reset = function(){
	this.data = [];
};

PriceChart.prototype.drawChart = function() {

	$.plot($(this.containerId), this.data, this.options);
};
