var PriceWidgets = function(priceWidgets){
	this.priceWidgets = priceWidgets;
};

PriceWidgets.prototype.reset = function(){
	for(var i = 0; i < this.priceWidgets.length; i++){
		this.priceWidgets[i].reset();
	}
};

PriceWidgets.prototype.update = function(response){
	for(var i = 0; i < this.priceWidgets.length; i++){
		this.priceWidgets[i].update(response);
	}
};