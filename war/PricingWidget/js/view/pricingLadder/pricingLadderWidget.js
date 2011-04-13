var PricingLadderWidget = function(pricingLadderRenderer){
	this.pricingLadderRenderer = pricingLadderRenderer;
};

PricingLadderWidget.prototype.reset = function(){	
	this.pricingLadderRenderer.reset();
};

PricingLadderWidget.prototype.update = function(pricingModel){	
	console.time('PricingLadderWidget');
	this.pricingLadderRenderer.render(pricingModel);	
	console.timeEnd('PricingLadderWidget');
};

