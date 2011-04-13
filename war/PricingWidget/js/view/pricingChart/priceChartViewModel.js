var PriceChartViewModel = function(maxSeries){
	this.data = [];
	this.maxSeries = maxSeries;	
};

PriceChartViewModel.prototype.insert = function(seriesNumber, pointId, dataPoint){
	if(this._hasMaxSeriesReached())		
		dataPoint.seriesNumber = this.maxSeries;	
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
		var firstSeries = this.data[0]; 
		this.data.shift();
		this.data.push([]);		
		delete firstSeries;
	}
};

PriceChartViewModel.prototype._hasMaxSeriesReached = function(){
	return this.data.length == this.maxSeries;
};

PriceChartViewModel.prototype.getData = function(){
	for(var i=0; i < this.data.length; i++){
		var series = this.data[i];
		for(var j = 0; j < series.length; j++){
			if(this._hasMaxSeriesReached()){
				var dataPoint = series[j];
				dataPoint.seriesNumber =  dataPoint.seriesNumber - 1;
			}
		}
	}	
	return {dataPoints : this.data};
};
