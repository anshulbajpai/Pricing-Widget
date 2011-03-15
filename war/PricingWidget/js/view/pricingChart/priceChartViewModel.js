var PriceChartViewModel = function(maxSeries){
	this.data = [];
	this.maxSeries = maxSeries;	
};

PriceChartViewModel.prototype.insert = function(seriesNumber, pointId, dataPoint){
	if(this._hasMaxSeriesReached())		
		dataPoint[0] = this.maxSeries;	
	this._shiftSeriesIfFull(seriesNumber, pointId);
	this._addSeriesIfNotPresent(seriesNumber);		
	this.data[this.data.length -1].push(dataPoint);
};

PriceChartViewModel.prototype._addSeriesIfNotPresent = function(seriesNumber){
	if(this.data[seriesNumber] == null)
		this.data.push([]);
};

PriceChartViewModel.prototype._shiftSeriesIfFull = function(seriesNumber, pointId){
	if(pointId == 0 && this._hasMaxSeriesReached()){
		this.data.shift();
		this.data.push([]);		
	}
};

PriceChartViewModel.prototype._hasMaxSeriesReached = function(){
	return this.data.length == this.maxSeries;
};

PriceChartViewModel.prototype._getMaxPrice = function(price, currentMaxPrice){
	return price > currentMaxPrice ? price : currentMaxPrice;		
};

PriceChartViewModel.prototype._getMinPrice = function(price, currentMinPrice){
	return price < currentMinPrice ? price : currentMinPrice;		
};

PriceChartViewModel.prototype.getData = function(){
	var maxPrice = 0;
	var minPrice = Number.MAX_VALUE;
	for(var i=0; i < this.data.length; i++){
		for(var j = 0; j < this.data[i].length; j++){
			if(this._hasMaxSeriesReached()){
				this.data[i][j][0] = this.data[i][j][0] - 1;
			}
		}
		var maxPriceForSeries = this.data[i][0][1];
		var minPriceForSeries = this.data[i][this.data[i].length-1][1];
		maxPrice = this._getMaxPrice(maxPriceForSeries, maxPrice);
		minPrice = this._getMinPrice(minPriceForSeries, minPrice);
	}	
	var spreadAverage = (maxPrice - minPrice)/(maxPrice + minPrice);
	return {dataPoints : this.data, priceBound : {minPrice : minPrice - spreadAverage, maxPrice : maxPrice + spreadAverage}};
};