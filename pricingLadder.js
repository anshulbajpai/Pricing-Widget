var PricingLadder = function(urlTemplate, ajaxWrapper, pricingLadderParser, pricingLadderRenderer){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingLadderParser = pricingLadderParser;
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadder.prototype.showPricingLadderFor = function(id){
	this._getResponseFor(id);
};

PricingLadder.prototype._getResponseFor = function(id){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(id), "", this._successCallback, this);
};

PricingLadder.prototype._successCallback = function(response){
	this.pricingLadderRenderer.render(this.pricingLadderParser.createLadderStepsFrom(response));
};