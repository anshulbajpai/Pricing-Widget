var PriceChart = function (containerId) {
    this.data = this._createFreshPriceChartViewModel();
    this.containerId = containerId;
	this.options = {series : { map: { pointDimension: 3, active: true, show: true}}, xaxis : {noTicks : true}};
	this.plot = null;
};

PriceChart.prototype.MAX_SERIES = 112;

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
	
	this.options.y2axis = {min : priceBound.minPrice, max : priceBound.maxPrice};	
	if(!this.plot)
		this.plot = $.plot($(this.containerId),data.dataPoints , this.options);
	else{
		this.plot.getOptions().y2axis = this.options.y2axis;
		this.plot.setData(data.dataPoints);
		this.plot.setupGrid();
		this.plot.draw();		
	}
};