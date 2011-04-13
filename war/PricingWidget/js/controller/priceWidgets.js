var PriceWidgets = function(priceWidgets){
	this.priceWidgets = priceWidgets;
};

PriceWidgets.prototype.reset = function(){
	for(var i = 0; i < this.priceWidgets.length; i++) {
		this.priceWidgets[i].reset();
	}
};

PriceWidgets.prototype.update = function(pricingModel){	
	console.time('PriceWidgets'); 
	for(var i = 0; i < this.priceWidgets.length; i++) {
		this.priceWidgets[i].update(pricingModel);
	}
	console.timeEnd('PriceWidgets');
	delete pricingModel;
};