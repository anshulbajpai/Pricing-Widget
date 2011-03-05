var PricingLadderWidget = function(pricingLadderParser, pricingLadderRenderer){
	this.pricingLadderParser = pricingLadderParser;
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadderWidget.prototype.reset = function(){
	this.pricingLadderRenderer.reset();
};

PricingLadderWidget.prototype.update = function(response){
	this.pricingLadderRenderer.render(this.pricingLadderParser.createLadderStepsFrom(response));
};

