var PricingLadderWidget = function(pricingLadderRenderer){
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadderWidget.prototype.reset = function(){
	this.pricingLadderRenderer.reset();
};

PricingLadderWidget.prototype.update = function(pricingData){
	this.pricingLadderRenderer.render(pricingData);
};

