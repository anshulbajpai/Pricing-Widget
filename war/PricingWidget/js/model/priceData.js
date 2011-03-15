var PriceData = function(quantity, price){
	this.quantity = quantity;	
	this.price = price;
	this.priceChanged = false;
};

PriceData.prototype.hasLowerPriceThan = function(otherPriceData){
	return this.price <= otherPriceData.price;
};

PriceData.prototype.hasHigherPriceThan = function(otherPriceData){
	return this.price >= otherPriceData.price;
};

PriceData.prototype.determinePriceChange = function(otherPriceData){
	this.priceChanged = this.price != otherPriceData.price;
};