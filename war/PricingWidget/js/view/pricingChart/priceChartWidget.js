var PriceChartWidget = function (priceChart) {
    this.count = 0;
	this.priceChart = priceChart;
};

PriceChartWidget.prototype.update = function(pricingModel) {
	var askData = pricingModel.askData;
	var bidData = pricingModel.bidData;	
	
	var bidColorFactor = this._getColorFactorFor(bidData);
	var askColorFactor = this._getColorFactorFor(askData);
	
	for(var i =0; i < bidData.length; i++){
		this._updateGraphData(bidData[i], bidColorFactor, i, false);
	}
	for(var j = 0; j < askData.length; j++){
		this._updateGraphData(askData[j], askColorFactor, i+j, true);
	}
	this.priceChart.drawChart();
	this.count++;
};
	
PriceChartWidget.prototype.reset = function(){
	this.count = 0;
	this.priceChart.reset();
};

PriceChartWidget.prototype._getColorFactorFor = function(dataArray) {
	var max = 0;
	var min = Number.MAX_VALUE;
	for (var i = 0; i < dataArray.length; i++) {
		var priceData = dataArray[i];
		if (priceData.quantity > max) {
			max = priceData.quantity;
		}
		if (priceData.quantity < min) {
			min = priceData.quantity;
		}
	}
	return max - min;
};

PriceChartWidget.prototype._updateGraphData = function(pricePoint, colorFactor, pointId, isAskPoint) {
	var maxSeries = this.priceChart.MAX_SERIES;
	this.priceChart.setDataPoint(this.count%maxSeries, pointId, [this.count%maxSeries, pricePoint.price, pricePoint.quantity/colorFactor , isAskPoint]);
};
