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
	this.bestBidData = null;
	this.bestAskData = null;	
	this.lastReceivedBidData = null;
	this.lastReceivedAskData = null;
	this.title = null;
	this.timerId = setInterval(function(){that._spit();}, 1000);
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
	var bidData = this.bestBidData || this.lastReceivedBidData;
	var askData = this.bestAskData || this.lastReceivedAskData;
	this.bestBidData = null;
	this.bestAskData = null;
	if(bidData && askData)
		this.callback.call(this.callerReference, new PriceModel(this.title, bidData.data, askData.data));	
	verifier.addFinalUpdate(bidData, askData);
};