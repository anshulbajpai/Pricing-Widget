var PriceChartData = function(){
	this.data = [];
    this.min = 1000000;
	this.max = 0;
};

PriceChartData.prototype.insert = function(seriesNumber, pointId, dataPoint){
	this._addSeriesIfNotPresent(seriesNumber);
	this._shiftSeriesIfPointPresent(seriesNumber, pointId);
	this.data[seriesNumber].push(dataPoint);
	this._setMinMaxPrice(dataPoint[1]);
};

PriceChartData.prototype._addSeriesIfNotPresent = function(seriesNumber){
	if(this.data[seriesNumber] == null)
		this.data[seriesNumber] = [];
};

PriceChartData.prototype._shiftSeriesIfPointPresent = function(seriesNumber, pointId){
	if(this.data[seriesNumber][pointId] != null)	
		this.data[seriesNumber].shift();
};

PriceChartData.prototype._setMinMaxPrice = function(price){
	if(price > this.max)
		this.max = price;
	if(price < this.min)
		this.min = price;
};

PriceChartData.prototype.getMin = function(){
	var average = (this.max - this.min) /2 ;
	return  this.min - average;
};

PriceChartData.prototype.getMax = function(){
	var average = (this.max - this.min) /2 ;
	return  this.max + average;
};

PriceChartData.prototype.getData = function(){
	return  this.data;
};