var PriceChartWidget = function (priceChart, parser) {
    this.count = 0;
	this.priceChart = priceChart;
	this.parser = parser;
};

PriceChartWidget.prototype.update = function(data) {
	var priceData = this.parser.parse(data);
	var askData = priceData.askData;
	var bidData = priceData.bidData;
	++this.count;
	var maxBidQuantity = this._getMaxQuantity(bidData);
	var maxAskQuantity = this._getMaxQuantity(askData);
	for(var i =0; i < bidData.length; i++){
		this._updateGraphData(bidData[i], maxBidQuantity, i, false);
	}
	for(var j = 0; j < askData.length; j++){
		this._updateGraphData(askData[j], maxAskQuantity, i+j, true);
	}
	this.priceChart.drawChart();
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
	this.priceChart.setDataPoint((this.count-1)%50, pointId, [this.count, pricePoint.price, pricePoint.quantity / max, isAskPoint]);
};
