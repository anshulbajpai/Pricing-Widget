var PriceData = function(quantity, price){
	this.quantity = quantity;	
	this.price = price;
};

PriceData.prototype.hasLowerPriceThan = function(otherPrice){
	return this.price < otherPrice;
};

PriceData.prototype.hasHigherPriceThan = function(otherPrice){
	return this.price > otherPrice;
};