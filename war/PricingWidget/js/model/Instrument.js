var Instrument = function(data){
	var dataItems = data.split("|");
	this.orderBookId = dataItems[0];
	this.status = dataItems[1];
	this.commonName = dataItems[2];
	if(this.status == "Closed")
		this.spread = "NA";
	else{
		var spread = this._calculateSpread(this._parseTradeData(dataItems[3]), this._parseTradeData(dataItems[4]));
		this.spread = this._roundToFiveDecimalPlace(spread);
	}
};

Instrument.prototype._calculateSpread = function(bidData, askData){	
	return this._calculatePrice(askData[0]) - this._calculatePrice(bidData[0]);
};

Instrument.prototype._parseTradeData = function(data){
	return data.split(';');
};

Instrument.prototype._roundToFiveDecimalPlace = function(value){
	return Math.round(value*Math.pow(10,5))/Math.pow(10,5);
};

Instrument.prototype._calculatePrice = function(data){
	return parseFloat(data.split('@')[1]);
};