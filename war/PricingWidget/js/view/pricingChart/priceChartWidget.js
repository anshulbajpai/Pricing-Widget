var PriceChartWidget = function (priceChart) {
    this.count = 0;
	this.priceChart = priceChart;
};

PriceChartWidget.prototype.update = function(pricingModel) {
	var askData = pricingModel.askData;
	var bidData = pricingModel.bidData;	
	
	var bidMaxQuantity = this._getMaxQuantityFor(bidData);
	var askMaxQuantity = this._getMaxQuantityFor(askData);
	
	for(var i = 0; i < askData.length; i++){
		this._updateGraphData(askData[i], askMaxQuantity, i, true);
	}
	
	for(var j =0; j < bidData.length; j++){
		this._updateGraphData(bidData[j], bidMaxQuantity, i+j, false);
	}
	
	this.priceChart.drawChart();
	this.count++;
};
	
PriceChartWidget.prototype.reset = function(){
	this.count = 0;
	this.priceChart.reset();
};

PriceChartWidget.prototype._getMaxQuantityFor = function(dataArray) {
	var maxQuantity = 0;	
	for (var i = 0; i < dataArray.length; i++) {
		var priceData = dataArray[i];
		if (priceData.quantity > maxQuantity) {
			maxQuantity = priceData.quantity;
		}
	}	
	return maxQuantity;
};

PriceChartWidget.prototype._updateGraphData = function(pricePoint, maxQuantity, pointId, isAskPoint) {
	var maxSeries = this.priceChart.MAX_SERIES;
	this.priceChart.setDataPoint(this.count%maxSeries, pointId, [this.count%maxSeries, pricePoint.price, this._getColorFactorFor(pricePoint.quantity, maxQuantity), isAskPoint]);
};

PriceChartWidget.prototype._getColorFactorFor = function(quantity, maxQuantity){
	return ((quantity/maxQuantity)*0.8) + 0.2;
};