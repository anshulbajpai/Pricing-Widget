var PricingLadder = function(){
	this.urlTemplate = new Url('http://marketdata.lmaxtrader.com/longPoll?orderBookId={0}&init=true');
};

PricingLadder.prototype.showLadderFor = function(id){
	this._getResponseFor(id);
};

PricingLadder.prototype._getResponseFor = function(id){
	new AjaxWrapper().sendRequest(this.urlTemplate.randomize().format(id),this._successCallback);
};

PricingLadder.prototype._successCallback = function(responseText){
	alert(responseText);
};