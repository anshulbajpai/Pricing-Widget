var PriceChartData = function(){
	this.data = [];
    this.min = 1000000;
	this.max = 0;
	this.maxSeries = 43;
	this.canShift = false;
};

PriceChartData.prototype.insert = function(seriesNumber, pointId, dataPoint){
	this._shiftSeriesIfFull(seriesNumber, pointId);
	this._addSeriesIfNotPresent(seriesNumber);
	if(seriesNumber >= this.maxSeries){		
		dataPoint[0] = this.maxSeries;		
		this.data[this.maxSeries - 1].push(dataPoint);		
	}
	else
		this.data[seriesNumber].push(dataPoint);
	this._setMinMaxPrice(dataPoint[1]);
};

PriceChartData.prototype._addSeriesIfNotPresent = function(seriesNumber){
	if(this.data[seriesNumber] == null &&  seriesNumber < this.maxSeries)
		this.data.push([]);
};

PriceChartData.prototype._shiftSeriesIfFull = function(seriesNumber, pointId){
	if(pointId == 0 && this.canShift){
		this.data.shift();
		this.data.push([]);
	}
	if(!this.canShift && seriesNumber + 1 == this.maxSeries)
		this.canShift = true;
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
	if(this.canShift){
		for(var i=0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				this.data[i][j][0] = this.data[i][j][0] - 1;
			}
		}
	}
	return this.data;
};