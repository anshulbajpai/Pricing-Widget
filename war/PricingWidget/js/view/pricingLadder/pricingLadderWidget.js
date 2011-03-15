var PricingLadderWidget = function(pricingLadderRenderer){
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadderWidget.prototype.reset = function(){	
	this.pricingLadderRenderer.reset();
};

PricingLadderWidget.prototype.update = function(pricingModel){	
	this.pricingLadderRenderer.render(pricingModel);	
};

