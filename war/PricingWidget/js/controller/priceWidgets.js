var PriceWidgets = function(priceWidgets){
	this.priceWidgets = priceWidgets;
};

PriceWidgets.prototype.reset = function(){
	for(var i = 0; i < this.priceWidgets.length; i++) {
		this.priceWidgets[i].reset();
	}
};

PriceWidgets.prototype.update = function(pricingModel){	
	for(var i = 0; i < this.priceWidgets.length; i++) {
		this.priceWidgets[i].update(pricingModel);
	}
	delete pricingModel;
};