var Instrument = function(data){
	var dataItems = data.split("|");
	this.orderBookId = dataItems[0];
	this.status = dataItems[1];
	this.commonName = dataItems[2];
	if(this.status == "Closed")
		this.spread = "NA";
	else{
		this.spread = this._calculateSpread(this._parseTradeData(dataItems[3]), this._parseTradeData(dataItems[4]));
	}
};

Instrument.prototype._calculateSpread = function(bidData, askData){	
	var buyPrice = this._calculatePrice(askData[0]);
	var sellPrice = this._calculatePrice(bidData[0]);
    var dot = sellPrice.indexOf('.');
    this.precision = dot != -1 ? (sellPrice.length - dot - 1) : 0;
    return (buyPrice - sellPrice).toFixed(this.precision);
};

Instrument.prototype._parseTradeData = function(data){
	return data.split(';');
};

Instrument.prototype._calculatePrice = function(data){
	return data.split('@')[1];
};