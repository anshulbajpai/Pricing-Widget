var PricingLadder = function(urlTemplate, ajaxWrapper, pricingLadderParser, pricingLadderRenderer){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingLadderParser = pricingLadderParser;
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadder.prototype.showPricingLadderFor = function(instrumentId, instrumentName){
	this._getPricingLadderTitle().innerHTML = instrumentName;
	this._getResponseFor(instrumentId);
};

PricingLadder.prototype._getResponseFor = function(instrumentId){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(instrumentId), "", this._successCallback, this);
};

PricingLadder.prototype._successCallback = function(response){
	this.pricingLadderRenderer.render(this.pricingLadderParser.createLadderStepsFrom(response));
};

PricingLadder.prototype._getPricingLadderTitle = function(){
	return document.getElementById('pricingLadderTitle');
};