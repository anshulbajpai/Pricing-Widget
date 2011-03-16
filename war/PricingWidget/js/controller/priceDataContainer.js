var PriceDataContainer = function(callback, callerReference){
	this.timerId = -1;
	this.callerReference = callerReference;
	this.callback = callback;
};

PriceDataContainer.prototype.reset = function(){
	var that = this;
	if (-1 != this.timerId)
	{
		clearInterval(this.timerId);
	}
	this._resetData();	
};

PriceDataContainer.prototype.init = function(){
	var that = this;	
	this.timerId = setInterval(function(){that._spit();}, 1000);
};

PriceDataContainer.prototype._resetData = function(){
	this._resetBestData();	
	this.lastReceivedBidData = this.bestBidData;
	this.lastReceivedAskData = this.bestAskData;
	this.title = null;
};

PriceDataContainer.prototype._resetBestData = function(){
	this.bestBidData = new BidData();
	this.bestAskData = new AskData();	
};

PriceDataContainer.prototype.add = function(pricingModel){
	this.title = pricingModel.title;
	this.bestBidData = pricingModel.getBetterBidData(this.bestBidData);
	this.bestAskData = pricingModel.getBetterAskData(this.bestAskData);
	this.lastReceivedBidData = pricingModel.bidData;
	this.lastReceivedAskData = pricingModel.askData;
	verifier.addInterimUpdate(this.bestBidData, this.bestAskData, this.lastReceivedBidData, this.lastReceivedAskData);
};

PriceDataContainer.prototype._spit = function(){
	var bidData = this.bestBidData.hasData() ? this.bestBidData : this.lastReceivedBidData;
	var askData = this.bestAskData.hasData() ? this.bestAskData : this.lastReceivedAskData;
	this._resetBestData();	
	if(bidData.hasData() && askData.hasData())
		this.callback.call(this.callerReference, new PriceModel(this.title, bidData.data, askData.data));	
	verifier.addFinalUpdate(bidData, askData);
};