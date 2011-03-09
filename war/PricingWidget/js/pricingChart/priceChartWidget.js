var PriceChartWidget = function (priceChart) {
    this.count = 0;
	this.priceChart = priceChart;
};

PriceChartWidget.prototype.update = function(pricingData) {
	var askData = pricingData.askData;
	var bidData = pricingData.bidData;	
	var maxBidQuantity = this._getMaxQuantity(bidData);
	var maxAskQuantity = this._getMaxQuantity(askData);
	for(var i =0; i < bidData.length; i++){
		this._updateGraphData(bidData[i], maxBidQuantity, i, false);
	}
	for(var j = 0; j < askData.length; j++){
		this._updateGraphData(askData[j], maxAskQuantity, i+j, true);
	}
	this.priceChart.drawChart();
	this.count++;
};
	
PriceChartWidget.prototype.reset = function(){
	this.count = 0;
	this.priceChart.reset();
};

PriceChartWidget.prototype._getMaxQuantity = function(dataArray) {
	var max = 0;
	for (var i = 0; i < dataArray.length; i++) {
		var priceData = dataArray[i];
		if (priceData.quantity > max) {
			max = priceData.quantity;
		}
	}
	return max;
};

PriceChartWidget.prototype._updateGraphData = function(pricePoint, max, pointId, isAskPoint) {
	var maxSeries = this.priceChart.MAX_SERIES;
	this.priceChart.setDataPoint(this.count%maxSeries, pointId, [this.count%maxSeries, pricePoint.price, pricePoint.quantity / max, isAskPoint]);
};
