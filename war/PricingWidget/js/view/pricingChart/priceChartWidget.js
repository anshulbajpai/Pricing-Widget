var PriceChartWidget = function (priceChart) {
    this.count = 0;
	this.priceChart = priceChart;
};

PriceChartWidget.prototype.update = function(pricingModel) {
	var askData = pricingModel.askData;
	var bidData = pricingModel.bidData;	
	
	var bidMaxValue = this._getMaxValueFor(bidData);
	var askMaxValue = this._getMaxValueFor(askData);
	
	for(var i =0; i < bidData.length; i++){
		this._updateGraphData(bidData[i], bidMaxValue, i, false);
	}
	for(var j = 0; j < askData.length; j++){
		this._updateGraphData(askData[j], askMaxValue, i+j, true);
	}
	this.priceChart.drawChart();
	this.count++;
};
	
PriceChartWidget.prototype.reset = function(){
	this.count = 0;
	this.priceChart.reset();
};

PriceChartWidget.prototype._getMaxValueFor = function(dataArray) {
	var max = 0;	
	for (var i = 0; i < dataArray.length; i++) {
		var priceData = dataArray[i];
		if (priceData.quantity > max) {
			max = priceData.quantity;
		}
	}	
	return max;
};

PriceChartWidget.prototype._updateGraphData = function(pricePoint, maxQuantity, pointId, isAskPoint) {
	var maxSeries = this.priceChart.MAX_SERIES;
	this.priceChart.setDataPoint(this.count%maxSeries, pointId, [this.count%maxSeries, pricePoint.price, this._getColorFactorFor(pricePoint.quantity, maxQuantity), isAskPoint]);
};

PriceChartWidget.prototype._getColorFactorFor = function(quantity, maxQuantity){
	return ((quantity/maxQuantity)*0.8) + 0.2;
};