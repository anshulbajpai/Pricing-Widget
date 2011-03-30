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
	if(otherPriceData.price) {
		this.priceChanged = this.price != otherPriceData.price;
		if(this.priceChanged) {
			this.priceIncreased = (this.price > otherPriceData.price);
		}
	}
};

