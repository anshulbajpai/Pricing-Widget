var PriceData = function(quantity, price){
	this.quantity = quantity;	
	this.price = price;
	this.priceChanged = false;
};

PriceData.prototype.hasLowerPriceThan = function(otherPriceData){
	return this.getPriceAsFloat() <= otherPriceData.getPriceAsFloat();
};

PriceData.prototype.hasHigherPriceThan = function(otherPriceData){
	return this.getPriceAsFloat() >= otherPriceData.getPriceAsFloat();
};

PriceData.prototype.determinePriceChange = function(otherPriceData){
	otherPrice = otherPriceData.getPriceAsFloat();
	currentPrice = this.getPriceAsFloat();
	if(otherPrice) {
		this.priceChanged = currentPrice != otherPrice;
		if(this.priceChanged) {
			this.priceIncreased = (currentPrice > otherPrice);
		}
	}
};

PriceData.prototype.getPriceAsFloat = function() {
	return parseFloat(this.price);
};

