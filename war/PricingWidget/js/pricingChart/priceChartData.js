var PriceChartData = function(maxSeries){
	this.data = [];
	this.maxSeries = maxSeries;	
};

PriceChartData.prototype.insert = function(seriesNumber, pointId, dataPoint){
	if(this._hasMaxSeriesReached())		
		dataPoint[0] = this.maxSeries;	
	this._shiftSeriesIfFull(seriesNumber, pointId);
	this._addSeriesIfNotPresent(seriesNumber);		
	this.data[this.data.length -1].push(dataPoint);
};

PriceChartData.prototype._addSeriesIfNotPresent = function(seriesNumber){
	if(this.data[seriesNumber] == null)
		this.data.push([]);
};

PriceChartData.prototype._shiftSeriesIfFull = function(seriesNumber, pointId){
	if(pointId == 0 && this._hasMaxSeriesReached()){
		this.data.shift();
		this.data.push([]);		
	}
};

PriceChartData.prototype._hasMaxSeriesReached = function(){
	return this.data.length == this.maxSeries;
};

PriceChartData.prototype._getMaxPrice = function(price, currentMaxPrice){
	return price > currentMaxPrice ? price : currentMaxPrice;		
};

PriceChartData.prototype._getMinPrice = function(price, currentMinPrice){
	return price < currentMinPrice ? price : currentMinPrice;		
};

PriceChartData.prototype.getData = function(){
	var hasMaxSeriesSeached = this._hasMaxSeriesReached();
	var maxPrice = 0;
	var minPrice = 1000000;
	for(var i=0; i < this.data.length; i++){
		for(var j = 0; j < this.data[i].length; j++){
			if(hasMaxSeriesSeached){
				this.data[i][j][0] = this.data[i][j][0] - 1;
			}
			var price = this.data[i][j][1];
			maxPrice = this._getMaxPrice(price, maxPrice);
			minPrice = this._getMinPrice(price, minPrice);
		}
	}	
	var spreadAverage = (maxPrice - minPrice)/(maxPrice + minPrice);
	return {dataPoints : this.data, priceBound : {minPrice : minPrice - spreadAverage, maxPrice : maxPrice + spreadAverage}};
};