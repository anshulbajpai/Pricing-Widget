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
	this._getChart().show();
	this._updatePriceChartTitle(pricingModel.title);
	this.priceChart.drawChart(this._getTickDecimals(askData[0].price));
	this.count++;
};
	
PriceChartWidget.prototype.reset = function(){
	this.count = 0;
	this.priceChart.reset();
	this._getChart().hide();
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
	var dataPoint = new DataPoint(this.count%maxSeries, pricePoint.price, this._getColorFactorFor(pricePoint.quantity, maxQuantity), isAskPoint);
	this.priceChart.setDataPoint(this.count%maxSeries, pointId, dataPoint);
};

PriceChartWidget.prototype._getColorFactorFor = function(quantity, maxQuantity){
	return ((quantity/maxQuantity)*0.8) + 0.2;
};

PriceChartWidget.prototype._getChart = function() {
	return $('#chart');
};

PriceChartWidget.prototype._updatePriceChartTitle = function(title){
	$('#priceChartTitle').text(title);
};

PriceChartWidget.prototype._getTickDecimals = function(maxPrice){
	var dot = maxPrice !== null ? maxPrice.indexOf('.') : -1;
	var fixedPointPrecision = dot != -1 ? (maxPrice.length - dot - 1) : 0;
	return fixedPointPrecision;
};
