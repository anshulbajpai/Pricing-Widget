var PriceChartData = function(maxSeries){
	this.data = [];
	this.maxSeries = maxSeries;	
};

PriceChartData.prototype.insert = function(seriesNumber, pointId, dataPoint){
	this._addSeriesIfNotPresent(seriesNumber);
	this._shiftSeriesIfFull(seriesNumber, pointId);	
	if(this._hasMaxSeriesReached())		
		dataPoint[0] = this.maxSeries-1;		
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
}

PriceChartData.prototype.getData = function(){
	if(this._hasMaxSeriesReached()){
		for(var i=0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				this.data[i][j][0] = this.data[i][j][0] - 1;
			}
		}
	}
	return this.data;
};