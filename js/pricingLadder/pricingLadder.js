var PricingLadder = function(urlTemplate, ajaxWrapper, pricingLadderParser, pricingLadderRenderer){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingLadderParser = pricingLadderParser;
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadder.prototype.showPricingLadderFor = function(instrumentId, instrumentName){
	this._instrumentName = instrumentName;
	this._getResponseFor(instrumentId);
	priceWidget.resetGraph();
};

PricingLadder.prototype._getResponseFor = function(instrumentId){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(instrumentId), "", this._successCallback, this);
};

PricingLadder.prototype._successCallback = function(response){
	this._getPricingLadderTitle().innerHTML = this._instrumentName;
	this.pricingLadderRenderer.render(this.pricingLadderParser.createLadderStepsFrom(response));
	priceWidget.updateGraph(response);
};

PricingLadder.prototype._getPricingLadderTitle = function(){
	return document.getElementById('pricingLadderTitle');
};