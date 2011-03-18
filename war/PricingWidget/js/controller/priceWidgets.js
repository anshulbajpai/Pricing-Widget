var PriceWidgets = function(priceWidgets){
	this.priceWidgets = priceWidgets;
};

PriceWidgets.prototype.reset = function(){
	this.priceWidgets.each(function(index, priceWidget){
		priceWidget.reset();
	});
};

PriceWidgets.prototype.update = function(pricingModel){	
	this.priceWidgets.each(function(index, priceWidget){
		priceWidget.update(pricingModel);
	});
};